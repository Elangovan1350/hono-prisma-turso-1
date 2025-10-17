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
  secret: `${process.env.BETTER_AUTH_SECRET}`,
  baseURL: `${process.env.BETTER_AUTH_URL}`,
  emailAndPassword: { enabled: true },
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  trustedOrigins: [`${process.env.HOST_URL}`],
  advanced: {
    defaultCookieAttributes:
      process.env.NODE_ENV === "production"
        ? {
            sameSite: "none",
            secure: true,
            httpOnly: true,
            partitioned: true,
          }
        : undefined,
  },
});
