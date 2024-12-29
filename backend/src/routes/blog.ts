import { Hono } from 'hono';
import { createBlogInput, updateBlogInput } from '@yuvrajsingh23/medium-common';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/jwt'

interface Variables {
    userId: string
}

type Bindings = {
    DATABASE_URL: string;
    JWT_SECRET: string;
}

export const blogRouter = new Hono<{ Bindings: Bindings; Variables: Variables; }>();

blogRouter.use('/*', async (c, next) => {
    try {
        const jwt = c.req.header("authorization") || "";
        if (!jwt) {
            c.status(403);
            return c.json({
                error: "unauthorized!",
            });
        }
        const token = jwt.split(' ')[1];  // Bearer token

        const payload = await verify(token, c.env.JWT_SECRET);
        if (!payload) {
            c.status(403);
            return c.json({
                error: "unauthorized",
            });
        }
        c.set("userId", payload.id as string);
        await next();
        
    } catch (error) {
        c.status(403);
        return c.json({
            message: "You are not logged in"
        })
    }
});

blogRouter.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const {success} = createBlogInput.safeParse(body);

        if (!success) {
            c.status(411);
            return c.json({
                message: "Inputs are not correct"
            });
        }
        const authorId = c.get("userId");
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: authorId
            }
        });

        return c.json({
            id: blog.id
        });
    } catch (error) {
        c.status(500);
        return c.json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        });
    }
});

blogRouter.put('/', async (c) => {
    try{
        const body = await c.req.json();
        const {success} = updateBlogInput.safeParse(body);

        if (!success) {
            c.status(411);
            return c.json({
                message: "Inputs are not correct"
            });
        }

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const blog = await prisma.post.update({
            where:{
                id: body.id,
            },
            data:{
                title: body.title,
                content: body.content
            }
        });

        return c.json({
            id: blog.id
        });

    }catch(error){
        c.status(500);
        return c.json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        });
    }
});

// Here add pagination for a better performance
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blogs = await prisma.post.findMany({
        select:{
            title: true,
            content: true,
            id: true,
            author: {
                select: {
                    name: true,
                }
            }
        }
    });

    return c.json({
        blogs
    });
});

blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());

    try{
        const blog = await prisma.post.findFirst({
            where:{
                id: id,
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name : true,
                    }
                }
            }
        });

        return c.json({
            blog,
        });

    }catch(error){
        c.status(411);
        return c.json({
            messege: "Error while fetching blog post !",
        });
    }
});