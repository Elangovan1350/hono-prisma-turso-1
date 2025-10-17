import { Hono } from "hono";
// import { PrismaClient } from "@prisma/client";
// import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { cors } from "hono/cors";
import { auth } from "./utils/auth.js";
import { prisma } from "./utils/prismaConnect.js";

const app = new Hono();
// const adapter = new PrismaLibSQL({
//   url: `${process.env.TURSO_DATABASE_URL}`,
//   authToken: `${process.env.TURSO_AUTH_TOKEN}`,
// });
// const prisma = new PrismaClient({ adapter });

app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "https://react-js-froendend.vercel.app"],
    allowHeaders: ["Content-Type"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Auth routes
app.use("/api/auth/*", (c) => auth.handler(c.req.raw));

// Basic route
app.get("/", (c) => c.text("Hello Hono!"));

// User routes
app.get("/user", async (c) => {
  const user = await prisma.user.findMany({
    where: { emailVerified: false },
    include: { posts: true },
  });
  return c.json(user);
});

// Get user by email
app.get("/user/:email", async (c) => {
  const { email } = c.req.param();
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return c.json(user);
});

// Create a new post
app.post("/post", async (c) => {
  const { title, content, userId } = await c.req.json();
  const newPost = await prisma.post.create({
    data: { title, content, userId },
  });
  return c.json(newPost);
});

//  get user post
app.get("/posts/:userId", async (c) => {
  const { userId } = c.req.param();
  const userPosts = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      posts: {
        select: {
          title: true,
          content: true,
          id: true,
        },
      },
    },
  });
  return c.json(userPosts);
});

app.put("/updatePost/:id", async (c) => {
  const { id } = c.req.param();
  const { title, content } = await c.req.json();
  if (!title && !content) {
    return c.json({ error: "nothing to update" }, 400);
  }

  try {
    const updatePost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
      },
    });
    return c.json(updatePost);
  } catch (error) {
    return c.json({ error: "post not found and not update" }, 404);
  }
});

app.delete("/deletePost/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const deletepost = await prisma.post.delete({
      where: { id },
    });
    return c.json(deletepost);
  } catch (error) {
    return c.json({ error: "something is worng , post is not deleted" }, 404);
  }
});

export default app;
