import { Button, Group, Select, Stack, Title } from "@mantine/core";
import { getLocalPayloadSession } from "@/lib/payload-authjs-custom/payload/session/getLocalPayloadSession";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { hasPermission } from "@/lib/permissions";
import { type Location, type Event} from "@/payload-types";
import { getEventsForLocation } from "@/lib/events";
import EventStack, { type EventWithTimeType } from "@/components/event-stack";
import { RefereeTableSelect } from "@/app/(main_outer)/(main)/volunteer/referee/client";
import { lightFormat } from "date-fns";
import * as qs from 'qs-esm'

const eventTitleToFormMap:{[key: string]: string} = { // refences to match lib/import-teams-events-csv.ts and form match option
  "Robot Game Round 1": "1",
  "Robot Game Round 2": "1",
  "Robot Game Round 3": "1",
  "Robot Game Practice Round 1": "Practice 1",
  "Robot Game Practice Round 2": "Practice 2",
  "Robot Game Alliance Round": "Alliance 1",// not usable
}

function RefereeItem(urlprefix: string,{event, eventTimeType}: EventWithTimeType) {
  const team = event && event.teams && event.teams.length === 1 && typeof event.teams[0] !== 'string'? event.teams[0] : null
  const match = event?.title && event.title in eventTitleToFormMap ? { match: eventTitleToFormMap[event.title]} : null;
  return (
    <Group>
      <Title>{event?.start && lightFormat(event.start,"HH:mm")}</Title>
      {/*<Title order={4}>{JSON.stringify(event)}</Title>*/}
      { team && <>
        <Title>{team && team.number}</Title>
        <Title order={2}>{team && team.name}</Title>
        <Button component={'a'} href={urlprefix + '&' + qs.stringify({team:`${team.number} ${team.name}`, ...match})}>Score Now</Button>
      </>}
    </Group>)
}

export default async function RefereePage({searchParams}: { searchParams: Promise<{ table?: string | string[], referee?: string | string[] }> }) {
  const search = await searchParams
  const table = search.table && typeof search.table !== "object" ? search.table : undefined
  const referee = search.referee && typeof search.referee !== "object" ? search.referee : undefined
  const session = await getLocalPayloadSession()
  if (!session || !(await hasPermission("view:scoring"))) return <Title>Unauthorized</Title>
  const payload = await getPayload({config: configPromise})
  const eventconfig = await payload.findGlobal({slug:"eventconfig",})
  const robotgametables = (await payload.find({collection:"location",pagination:false, sort: "abbreviation", where:{location_type:{equals:"robotgame"}}})).docs
  const refereesNames = (await payload.find({collection:"users", pagination:false, limit:0, sort: "name", select: {name:true}, where:{role:{equals:"referee"}}})).docs.map(referee => referee.name).filter(refereename => !!refereename) as string[]
  const tableloc = robotgametables.find(l => l.abbreviation === table)
  const headgroup = (<RefereeTableSelect robotgametables={robotgametables.map(l => {return {abbreviation: l.abbreviation}})} refereesNames={refereesNames}/>)
    // <Group>
    //   <Select name="location" label="Table" value={table} data={robotgametables.map(loc => {return {label: loc.abbreviation, value: loc.abbreviation}})}/>
    //   <Select name="referee" label="Referee" value={referee} data={refereesNames}/>
    // </Group>)
  if (!tableloc) return headgroup

  const locEvents = await getEventsForLocation({location:tableloc})
  const scoringurlprefix = '/volunteer/referee/scoring?'+ qs.stringify({table:tableloc.abbreviation, referee:referee })
  return (
    <Stack>
      {headgroup}
      <EventStack events={locEvents} paperProps={{past:{bg:'#80ff8024'},current:{bg:'#00ff0040'},future:{bg:'#ffffff1c'}}} EventItem={RefereeItem.bind(null,scoringurlprefix)}/>
    </Stack>
  )
}