import { Title } from "@mantine/core";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { hasPermission } from "@/lib/permissions";
import { getJudgingFormValues } from "../util";
import JudgingClient from "@/app/(main_outer)/(main)/volunteer/judge/judging/client";

const searchToFormField: {[s:string]: string} = {
  "rubric": "Rubric",
  "team": "Team Name",
  "room": "Judging Room",
}

type JudgingSearchParams = { room?: string | string[], rubric?: string | string[], team?: string | string[] };

function searchParamsToFormPrefill(search: JudgingSearchParams, formvalues: Awaited<ReturnType<typeof getJudgingFormValues>>) {
  const formprefill: {[s:string]: string} = {}
  for (const param in search) {
    if (!['room','rubric','team'].includes(param)) {
      console.log("got judging param != 'room','rubric','team'", param)
      continue
    }
    const paramVal = search[param as 'room'|'rubric'|'team']
    if (!paramVal || typeof paramVal === 'object') {
      console.log("got judging param invalid val", paramVal)
      continue
    }
    if (param in searchToFormField) {
      const formfield = searchToFormField[param];
      if (formfield in formvalues) {
        const formentry = `entry.${formvalues[formfield].entryid}`
        if (!formvalues[formfield].values?.includes(paramVal)) console.log("got judging param val not in form",paramVal)
        formprefill[formentry] = paramVal
      } else {
        console.log("got judging param field not in Form", formfield)
      }
    } else {
      console.log("got judging param not in searchToFormField", param)
    }
  }
  return formprefill
}

export default async function Judging({searchParams}: { searchParams: Promise<JudgingSearchParams> }) {
  const search = await searchParams

  const payload = await getPayload({config: configPromise})
  const eventconfig = await payload.findGlobal({slug:"eventconfig",})
  if (!eventconfig.judgingForm) return <Title>Event Judging Form unset</Title>
  const form = (await hasPermission("view:judging")) ? eventconfig.judgingForm : undefined
  const formvalues = await getJudgingFormValues(eventconfig.judgingForm)
  console.dir({search, formvalues})
  const formprefillparams = searchParamsToFormPrefill(search, formvalues)
  console.dir({formprefillparams})
  return <JudgingClient form={form} formprefillparams={formprefillparams} />
}