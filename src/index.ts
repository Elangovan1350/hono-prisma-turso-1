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

    credentials: true,
  })
);

app.use("/api/auth/*", (c) => auth.handler(c.req.raw));
app.get("/", (c) => c.text("Hello Hono!"));
app.get("/user", async (c) => {
  const user = await prisma.user.findMany({
    where: { emailVerified: false },
  });
  return c.json(user);
});
app.get("/user/:email", async (c) => {
  const { email } = c.req.param();
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return c.json(user);
});

export default app;
