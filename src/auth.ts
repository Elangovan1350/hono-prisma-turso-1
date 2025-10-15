import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSQL({
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
});
const prisma = new PrismaClient({ adapter });
export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  secret: process.env.BETTER_AUTH_SECRET || "",
  baseUrl: process.env.BETTER_AUTH_URL || "",
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  trustedOrigins: [
    "http://localhost:5173",
    "https://react-js-froendend.vercel.app/",
  ],
});
