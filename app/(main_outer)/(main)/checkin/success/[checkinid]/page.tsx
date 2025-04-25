import { getPayload } from "payload";
import configPromise from '@payload-config'
import { IconCheck } from "@tabler/icons-react";
import { Stack, Title } from "@mantine/core";
import { Who } from "@/app/(main_outer)/(main)/checkin/[locationid]/[who]/page";
import { asNotID } from "@/lib/checkin";

type Args = {
  params: Promise<{
    checkinid: string
  }>
}

export default async function CheckedInDisplay({ params: paramsPromise }: Args) {
  const { checkinid } = await paramsPromise
  if (!checkinid || checkinid.length !== 24) return <h1>Invalid checkin</h1>
  const payload = await getPayload({ config: configPromise })
  const checkin = await payload.findByID({collection:"checkin",id:checkinid,depth:1,disableErrors:true})
  if (!checkin) return <h1>Checkin not found</h1>
  return (
    <Stack align={"center"}>
      <IconCheck size={"20vh"}/>
      <Title>Thanks for checking in</Title>
      <Title>at</Title>
      <Title>{asNotID(checkin.location).name}</Title>
      <Title>{checkin.who[0].toUpperCase()+checkin.who.substring(1)}</Title>
      { checkin.who as Who === 'team' && <Title>{asNotID(checkin.team)?.name}</Title>}
      { checkin.who as Who === 'person' && <Title>{asNotID(checkin.person)?.name}</Title>}
      { checkin.who as Who === 'volunteer' && <Title>{asNotID(checkin.user)?.name}</Title>}
      <Title>{new Date(checkin.updatedAt).toLocaleTimeString([],{hour: '2-digit', minute: '2-digit',timeZoneName: undefined})}</Title>
    </Stack>)
}