import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { cors } from "hono/cors";

const app = new Hono();
const adapter = new PrismaLibSQL({
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
});
const prisma = new PrismaClient({ adapter });

app.use(
  "*",
  cors({
    origin: [
      "https://hono-prisma-turso-1.vercel.app/",
      "http://localhost:3000/",
    ],
  })
);

app.get("/", async (c) => {
  const user = await prisma.user.findMany();
  return c.json(user);
});
app.post("/", async (c) => {
  const { email, name, password } = await c.req.json();
  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password,
    },
  });
  return c.json(newUser);
});

export default app;
