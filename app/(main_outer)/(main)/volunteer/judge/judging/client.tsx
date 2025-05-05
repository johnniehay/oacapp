"use client"

// import { useSearchParams } from "next/navigation";
import { useState } from "react";
import * as qs from 'qs-esm'

interface BaseMessage {
  message: string
}

interface SubmitMessage extends BaseMessage {
  text: string
}

export default function JudgingClient({form, formprefillparams}: {form?: string, formprefillparams?: {[s:string]: string}}) {
  // const searchParams = useSearchParams()
  const [loaded, setLoaded] = useState(false);
  const [submstatus, setSubmstatus] = useState("");
  if (typeof window !== "undefined") window.addEventListener("message", ({data, ...e}: {data:BaseMessage }) => {
    console.log({ data, ...e })
    if (data.message.includes("submit")) {
      const submMessage = data as SubmitMessage
      setSubmstatus(data.message.split("-")[1]+" "+submMessage.text)
    }
  });
  return <div>
    <iframe src={`https://docs.google.com/forms/d/e/${form}/viewform?${qs.stringify(formprefillparams)}`} style={{width:'100%',height:'80vh'}} onLoad={(e) => {
      console.log("onload",e)
      setLoaded(true)}}
      allowFullScreen={true}
    />
    Test scoring page {loaded ? "loaded "+submstatus : "not loaded"}
  </div>
}