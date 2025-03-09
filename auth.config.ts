// import {PrismaAdapter} from "@auth/prisma-adapter";
// import {prisma} from "@/prisma";
import Google from "next-auth/providers/google";
import Nodemailer from "@auth/core/providers/nodemailer";
import { NextAuthConfig } from "next-auth";


import type { User as PayloadUser } from "./payload-types";
import { PayloadAuthjsUser } from "@/lib/payload-authjs-custom";

declare module "next-auth" {
  /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
  interface User extends PayloadAuthjsUser<PayloadUser> {
  }
}


export const authConfig: NextAuthConfig = {
  // adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Nodemailer({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      // @ts-expect-error logger not defined in nodemailer options
      logger: true,
      debug: true
    })],
  session: { strategy: "database" },
  // providers: [],
  debug: true,
// redirectProxyUrl: "https://dev.oac.cids.org.za/api/auth"
}