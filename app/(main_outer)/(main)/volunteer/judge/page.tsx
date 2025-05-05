import { Button, Group, Select, Stack, Title } from "@mantine/core";
import { getLocalPayloadSession } from "@/lib/payload-authjs-custom/payload/session/getLocalPayloadSession";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { hasPermission } from "@/lib/permissions";
import type { Location, Event} from "@/payload-types";
import { getEventsForLocation } from "@/lib/events";
import EventStack, { type EventWithTimeType } from "@/components/event-stack";
import { JudgingRoomSelect } from "@/app/(main_outer)/(main)/volunteer/judge/client";
import { lightFormat } from "date-fns";
import * as qs from 'qs-esm'
import { getJudgingFormValues } from "./util"

function JudgeItem(urlprefix: string,{event, eventTimeType}: EventWithTimeType) {
  const team = event && event.teams && event.teams.length === 1 && typeof event.teams[0] !== 'string'? event.teams[0] : null
  const room = event && event.location && typeof event.location !== 'string'? event.location.abbreviation : null
  return (
    <Group>
      <Title>{event?.start && lightFormat(event.start,"HH:mm")}</Title>
      {/*<Title order={4}>{JSON.stringify(event)}</Title>*/}
      { team && <>
        <Title>{team && team.number}</Title>
        <Title order={2}>{team && team.name}</Title>
        <Button component={'a'} href={urlprefix + '&' + qs.stringify({team:`${team.number} ${team.name}`})}>Fill in Rubric</Button>
      </>}
    </Group>)
}

export default async function JudgePage({searchParams}: { searchParams: Promise<{ room?: string | string[], rubric?: string | string[] }> }) {
  const search = await searchParams
  const room = search.room && typeof search.room !== "object" ? search.room : undefined
  const rubric = search.rubric && typeof search.rubric !== "object" ? search.rubric : undefined
  const session = await getLocalPayloadSession()
  if (!session || !(await hasPermission("view:judging"))) return <Title>Unauthorized</Title>
  const payload = await getPayload({config: configPromise})
  const eventconfig = await payload.findGlobal({slug:"eventconfig",})
  if (!eventconfig.judgingForm) return <Title>Event RobotGame Form unset</Title>
  const judgingrooms = (await payload.find({collection:"location",pagination:false, sort: "abbreviation", where:{location_type:{equals:"judging"}}})).docs
  const formvalues = await getJudgingFormValues(eventconfig.judgingForm)
  const roomloc = judgingrooms.find(l => l.abbreviation === room)
  const headgroup = (<JudgingRoomSelect judgingrooms={judgingrooms.map(l => {return {abbreviation: l.abbreviation}})} rubrics={formvalues["Rubric"].values??[]} />)
  if (!roomloc) return headgroup

  const locEvents = await getEventsForLocation({location:roomloc})
  const scoringurlprefix = '/volunteer/judge/judging?'+ qs.stringify({room:roomloc.abbreviation,rubric:rubric})
  return (
    <Stack>
      {headgroup}
      <EventStack events={locEvents} paperProps={{past:{bg:'#80ff8024'},current:{bg:'#00ff0040'},future:{bg:'#ffffff1c'}}} EventItem={JudgeItem.bind(null,scoringurlprefix)}/>
    </Stack>
  )
}