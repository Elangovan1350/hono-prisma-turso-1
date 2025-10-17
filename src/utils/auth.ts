import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prismaConnect.js";
// import { PrismaClient } from "@prisma/client";
// import { PrismaLibSQL } from "@prisma/adapter-libsql";

// const adapter = new PrismaLibSQL({
//   url: `${process.env.TURSO_DATABASE_URL}`,
//   authToken: `${process.env.TURSO_AUTH_TOKEN}`,
// });
// const prisma = new PrismaClient({ adapter });
export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  trustedOrigins: [`${process.env.HOST_URL}`],
});
