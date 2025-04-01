import { withPayloadAuthConfig } from "@/auth";
import CustomSigninPageClient from "@/app/(main_outer)/signin/signin-client";
import { createActionURL } from "@auth/core";

export interface ProviderWithUrls {
  signinUrl: string
  type: string
  id: string
  name: string
}

const excludeProviders: string[]  = ['google']

export default async function CustomSigninPage() {
  // console.log("providers",withPayloadAuthConfig.providers)
  const providers: ProviderWithUrls[] = withPayloadAuthConfig.providers.filter(provider => {
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