"use client"

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import * as qs from 'qs-esm'

interface BaseMessage {
  message: string
}

interface SubmitMessage extends BaseMessage {
  text: string
}

export default function ScoringClient({referee:propReferee, form}: {referee?: string, form?: string}) {
  const searchParams = useSearchParams()
  // const referee = propReferee ?? searchParams?.get("referee")
  const [loaded, setLoaded] = useState(false);
  const [submstatus, setSubmstatus] = useState("");
  if (typeof window !== "undefined") window.addEventListener("message", ({data, ...e}: {data:BaseMessage }) => {
    console.log({ data, ...e })
    if (data.message.includes("submit")) {
      const submMessage = data as SubmitMessage
      setSubmstatus(data.message.split("-")[1]+" "+submMessage.text)
    }
  });
  const scoringsearch = {form, ...qs.parse(searchParams?.toString()??"")}

  return <div>
    Test scoring page {loaded ? "loaded "+submstatus : "not loaded"}
    <iframe src={`https://hay.cids.org.za/smsc/index.html?${qs.stringify(scoringsearch)}`} style={{width:'100%',height:'80vh'}} onLoad={(e) => {
      console.log("onload",e)
      setLoaded(true)}}
      allowFullScreen={true}
    />
  </div>
}