# WriteSpace => A Blogging Application

Welcome to the WriteSpace! This project is a platform where users can share their thoughts, write stories, and exchange knowledge. Built with a modern tech stack, it is designed to be scalable, serverless, and developer-friendly.

## Features

- **User Authentication**: Secure user sign-up and login.
- **Create, Read, Update, Delete (CRUD)**: Users can manage their posts seamlessly.
- **Rich Text Editor**: Write stories and articles with formatting options.
- **Categories & Tags**: Organize content for easy navigation.
- **Responsive Design**: Fully functional on mobile, tablet, and desktop.
- **Image Uploads**: Add images to your posts via Cloudinary integration.
- **Search Functionality**: Quickly find articles or stories.
- **Serverless Backend**: Efficient and scalable backend deployment using Hono.

## Tech Stack

### Frontend
- **React**: For building an interactive user interface.
- **TypeScript**: Ensures type safety and better development experience.

### Backend
- **Hono Framework**: A lightweight, fast web framework for building serverless applications.
- **Cloudflare Workers**: Deploying serverless backend globally.

### Database
- **PostgreSQL**: Reliable and robust database solution.
- **Prisma ORM**: Simplifies database queries and schema migrations.

### Cloud Storage
- **Cloudinary**: For managing and serving images.

## Project Structure

```
root
├── backend
│   ├── src
│   │   ├── handlers
│   │   ├── middlewares
│   │   └── routes
│   └── index.ts
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── utils
│   │   └── App.tsx
│   └── index.tsx
├── prisma
│   ├── schema.prisma
│   └── migrations
└── README.md
```

## Installation

### Prerequisites
- Node.js (>= 16.x)
- PostgreSQL
- Cloudinary Account

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/blogging-app.git
   cd blogging-app
   ```

2. **Install dependencies:**
   ```bash
   # For frontend
   cd frontend
   npm install

   # For backend
   cd ../backend
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in both the `frontend` and `backend` directories. Use the following template:
   ```env
   # Backend .env
   DATABASE_URL=postgresql://username:password@localhost:5432/blogging
   CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME

   # Frontend .env
   REACT_APP_API_URL=https://your-api-endpoint
   ```

4. **Set up the database:**
   ```bash
   cd backend
   npx prisma migrate dev
   ```

5. **Start the development servers:**
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd frontend
   npm start
   ```

6. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Backend
Deploy the backend on Cloudflare Workers using the Hono framework.

1. Install the Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Configure `wrangler.toml` for your project.

3. Deploy:
   ```bash
   wrangler deploy
   ```

### Frontend
Use any static hosting platform (e.g., Vercel, Netlify) for deploying the React frontend.

1. Build the project:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `build` directory to your hosting platform.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch 
3. Commit your changes.
4. Push to your branch.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, feel free to reach out at [yuvrajsingh01579@gmail.com](mailto:yuvrajsingh01579@gmail.com).

---

Happy blogging! 🚀
