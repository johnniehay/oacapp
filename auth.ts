import NextAuth from "next-auth"
import { withPayload } from "@/lib/payload-authjs-custom";
import payloadConfig from "@payload-config";
import { authConfig } from "@/auth.config";

export const withPayloadAuthConfig = withPayload(authConfig, { payloadConfig })

export const { handlers, signIn, signOut, auth } = NextAuth(withPayloadAuthConfig);