"use client"

import SigninPage from "@/node_modules/@auth/core/lib/pages/signin";
import { useSearchParams } from "next/navigation";
import type { ProviderWithUrls } from "@/app/(main_outer)/signin/page";
import { getCsrfToken} from "next-auth/react";
import { Suspense, useEffect, useRef, useState } from "react";
import { render, h } from "preact";
import pagecss from "@/node_modules/@auth/core/lib/pages/styles.js";
import type { Theme } from "@auth/core/types";

type SigninProps = { csrfToken: string; callbackUrl?: string; providers: ProviderWithUrls[], theme?:Theme }

export default function CustomSigninPageClient(
  { providers }: {providers:ProviderWithUrls[]}
) {
  const [csrfToken, setCsrfToken] = useState("")
  useEffect(() => {
    getCsrfToken().then(setCsrfToken)
  },[])

  const signinprops: SigninProps = {
    csrfToken:csrfToken,
    providers:providers,
    theme: {colorScheme: "auto",logo:"/oac-logo.jpg"}
  }
  return <>
    <style key={"pagecss"}>{pagecss}</style>
    <style key={"provider_image_height"}>{".signin .button img { height: 24px; order: -1; margin-right: 12px }"}</style>
    <style key={"provider_buttons"}>{"button { justify-content: center; box-shadow: 1px 1px 3px #1f1f1f }"}</style>
    <style key={"provider_mail_button"}>{"#submitButton { --color-info-text: #1f1f1f; --color-info: #ffffff }"}</style>
    <div className={`__next-auth-theme-${ signinprops.theme?.colorScheme ?? "auto" }`}>
      <Suspense fallback={ReactPreactSigninPageBridge(SigninPage,signinprops)}>
        <CustomSigninPageClientWithCallbackUrl signinprops={signinprops}/>
      </Suspense>
    </div>
  </>
}

export function CustomSigninPageClientWithCallbackUrl({signinprops}: {signinprops:SigninProps}) {
  const searchParams = useSearchParams()
  // console.log(searchParams.get("callbackUrl"))
  const callbackUrl = searchParams?.get("callbackUrl")
  // if (typeof callbackUrl !== "string") return "Error"
  signinprops.providers.forEach(provider => {
    if (!provider.signinUrl.includes('callbackUrl'))
      provider.signinUrl += `?${new URLSearchParams({ callbackUrl: callbackUrl ?? "/" })}`
  })
  return (<>{ReactPreactSigninPageBridge(SigninPage,{callbackUrl: callbackUrl ?? undefined, ...signinprops})}</>)
}


function ReactPreactSigninPageBridge(preactcomp: (props:SigninProps) => h.JSX.Element, props: SigninProps) {
  // Get the raw DOM node to render into
  const ref = useRef(null)

  useEffect(() => {
    const refval = ref.current;
    if (ref.current) {
      // Can't use two different JSX constructors in
      // the same file, so we're writing the JSX output
      // manually. (h is the same as createElement)
      render(h(preactcomp, props ), ref.current)
    }

    return () => {
      // Clear Preact rendered tree when the parent React
      // component unmounts
      if (refval)
        render(null, refval);
    }
  }, [preactcomp,props]);

  return <div className={"page"} ref={ref} />
}