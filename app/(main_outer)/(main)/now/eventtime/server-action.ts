"use server"

import { getPayload } from "payload";
import { add, sub } from "date-fns";
import configPromise from "@payload-config";
import { Title } from "@mantine/core";
import { redirect } from "next/navigation";

export async function forwardEventTime() {
  const payload = await getPayload({config: configPromise})
  const eventconfig = await payload.findGlobal({slug:"eventconfig",})
  if (!eventconfig.eventtime) return null
  const currEventTime = new Date(eventconfig.eventtime)
  await payload.updateGlobal({slug:"eventconfig", data:{eventtime:add(currEventTime,{minutes:5}).toISOString()}} )
  redirect("/now/eventtime")
}
export async function backwardEventTime() {
  const payload = await getPayload({config: configPromise})
  const eventconfig = await payload.findGlobal({slug:"eventconfig",})
  if (!eventconfig.eventtime) return null
  const currEventTime = new Date(eventconfig.eventtime)
  await payload.updateGlobal({slug:"eventconfig", data:{eventtime:sub(currEventTime,{minutes:5}).toISOString()}} )
  redirect("/now/eventtime")
}