import { getPayload } from "payload"
import configPromise from '@payload-config'
import { hasPermission } from "@/lib/permissions";
import { Group, Stack, Text, Title } from "@mantine/core";
import Flag from "@/components/flag";
import { peopleRoleOptions } from "@/payload/collections/People";
import Link from "next/link";

export default async function Page({ params: paramsPromise }: { params: Promise<{ personid?: string }> }){
  const hasperm = await hasPermission("view:team:details:basic") //TODO: maybe revisit permission
  const haspermfull = await hasPermission("view:team:details") //TODO: maybe revisit permission
  if (!hasperm) return <h1>Unauthorized</h1> //TODO: redirect to team
  const { personid } = await paramsPromise
  if (!personid || personid.length !== 24) return <h1>Invalid personid</h1>
  const payload = await getPayload({ config: configPromise })
  const person = await payload.findByID({collection:"people",id:personid})
  const team = person.team && typeof person.team !== "string" ? person.team : null
  const personcheckins = (await payload.find({collection:"checkin",pagination:false,sort:"createdAt",where:{person:{equals:person.id}}})).docs
  return (
    <Stack>
      <Title order={1}>{person.name}</Title>
      <Title order={2}>{peopleRoleOptions.find(pr => pr.value == person.role)?.label ??""}</Title>
      <Title order={1}>{team?.number} <Link style={{color: "revert", textDecoration: "revert"}} href={`/admin/collections/team/${team?.id}`}>{team?.name}</Link></Title>
      <Title>{ team && <Flag country={team.country}/>} {team?.country}</Title>
      { haspermfull && <Group><Text size={"lg"} fw={700}>Dietary Requirements</Text><Text size={"lg"}>{person.dietary_requirements}</Text></Group>}
      { haspermfull && <div><Text size={"lg"} fw={700}>Allergies and Other Dietary Requirements</Text><Text size={"lg"}>{person.allergies_and_other??"---"}</Text></div>}
      { haspermfull && <div><Text size={"lg"} fw={700}>Special Needs and Disabilities</Text><Text size={"lg"}>{person.special_needs??"---"}</Text></div>}
      { haspermfull && personcheckins.map(checkin => <Group key={checkin.id}>
        <Text>{typeof checkin.location !== "string" && checkin.location.name}</Text>
        <Text>{new Date(checkin.updatedAt).toLocaleTimeString([],{hour: '2-digit', minute: '2-digit',timeZoneName: undefined})}</Text>
      </Group>)}
    </Stack>)
}