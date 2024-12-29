import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { signupInput, signinInput } from '@yuvrajsingh23/medium-common';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';

type Bindings = {
    DATABASE_URL: string;
    JWT_SECRET: string;
}

export const userRouter = new Hono<{ Bindings: Bindings;}>();

userRouter.post('/signup', async (c) => {
    try {
        const body = await c.req.json();
        const {success} = signupInput.safeParse(body);

        if (!success) {
            c.status(411);
            return c.json({
                message: "Inputs are not correct"
            })
        }

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const existingUser = await prisma.user.findUnique({
            where: { username: body.username }
        });

        if (existingUser) {
            c.status(400);
            return c.json({ error: 'User already exists' });
        }

        const user = await prisma.user.create({
            data: {
                username: body.username,
                password: body.password, // In production, hash the password!
                name: body.name
            }
        });

        const token = await sign({ id: user.id }, c.env.JWT_SECRET);

        return c.json({
            message: 'User created successfully',
            jwt: token
        });

    } catch (error) {
        console.error('Signup error:', error);
        c.status(500);
        return c.json({ error: 'Internal server error' });
    }
});

userRouter.post('/signin', async (c) => {
    try {
        const body = await c.req.json();
        const {success} = signinInput.safeParse(body);
        
        if (!success) {
            c.status(411);
            return c.json({
                message: "Inputs are not correct"
            })
        }
        
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const user = await prisma.user.findUnique({
            where: {
                username: body.username,
            }
        });

        if (!user || user.password !== body.password) { // In production, compare hashed passwords
            c.status(403);
            return c.json({ error: 'Invalid credentials' });
        }

        const token = await sign({ id: user.id }, c.env.JWT_SECRET);

        return c.json({
            message: 'Login successful',
            jwt: token
        });

    } catch (error) {
        console.error('Signin error:', error);
        c.status(500);
        return c.json({ error: 'Internal server error' });
    }
});
