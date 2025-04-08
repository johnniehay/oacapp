import { withPayloadAuthConfig } from "@/auth";
import CustomSigninPageClient from "@/app/(main_outer)/signin/signin-client";
import { createActionURL } from "@auth/core";

export interface ProviderWithUrls {
  signinUrl: string
  type: string
  id: string
  name: string
}
const penv = process.env
const excludeProviders: string[] = ( penv.HIDE_AUTH_GOOGLE ?? false ) ? ['google'] : []

export default async function CustomSigninPage() {
  // console.log("providers",withPayloadAuthConfig.providers)
  const providers: ProviderWithUrls[] = withPayloadAuthConfig.providers.toReversed().filter(provider => {
    if(typeof provider !== 'function' && !excludeProviders.includes(provider.id)){
      return true
    } else return false
  }).map(provider => {
    const { id, name, type, signinUrl:providerSigninUrl } = provider as unknown as ProviderWithUrls
    const signinUrl = providerSigninUrl ?? `${createActionURL('signin','https',new Headers(), process.env,withPayloadAuthConfig)}/${id}`
    return {id, name:((name == "Nodemailer") ? "Email" : name), type, signinUrl}
  }) as unknown as ProviderWithUrls[]
  return(
    <CustomSigninPageClient
      providers={providers}
    />)
}