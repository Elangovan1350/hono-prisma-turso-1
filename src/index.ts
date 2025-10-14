import { Hono } from "hono";
import { PrismaClient } from "./prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { cors } from "hono/cors";
import { auth } from "./lib/auth";

const app = new Hono();
const adapter = new PrismaLibSQL({
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
});
const prisma = new PrismaClient({ adapter });

// app.use(
//   "*",
//   cors({
//     origin: "*",
//     allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );
app.use(
  "/api/*",
  cors({
    origin: [
      "http://localhost:5173",
      "https://hono-prisma-turso-1.vercel.app/",
    ], // Replace with your frontend's URL
    credentials: true,
  })
);

app.use("/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", async (c) => {
  const user = await prisma.user.findMany();
  return c.json(user);
});
// app.post("/", async (c) => {
//   const { email, name, password } = await c.req.json();
//   const newUser = await prisma.user.create({
//     data: {
//       email,
//       name,
//       password,
//     },
//   });
//   return c.json(newUser);
// });

export default app;
