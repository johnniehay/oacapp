import { Button, Title } from "@mantine/core";
import { hasPermission } from "@/lib/permissions";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { add, sub } from "date-fns";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import {forwardEventTime, backwardEventTime} from "./server-action"

export default async function EventTimePage() {
  const hasperm = await hasPermission("view:queuing:status") //TODO: add specific permission
  if (!hasperm) return <Title>Unauthorized</Title>
  const payload = await getPayload({config: configPromise})
  const eventconfig = await payload.findGlobal({slug:"eventconfig",})
  if (!eventconfig.eventtime) return <Title>Event Time unset</Title>
  const currEventTime = new Date(eventconfig.eventtime)

  return (
    <>
      <Title order={2}>Event Time <Button onClick={backwardEventTime}><IconMinus/></Button>{currEventTime.toLocaleString()}<Button onClick={forwardEventTime}><IconPlus/></Button></Title>
    </>
  )

}