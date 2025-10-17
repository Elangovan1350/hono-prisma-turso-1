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
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: process.env.HOST_URL,
      // domain: process.env.COOKIE_DOMAIN || undefined,
    },
    cookie: {
      sameSite: "none",
      secure: true,
      domain: process.env.HOST_URL,

      // domain: process.env.COOKIE_DOMAIN || undefined,
      path: "/",
    },
    defaultCookieAttributes: {
      secure: true,
      // httpOnly: true,
      sameSite: "none", // Allows CORS-based cookie sharing across subdomains
      // partitioned: true, // New browser standards will mandate this for foreign cookies
    },
  },
});
