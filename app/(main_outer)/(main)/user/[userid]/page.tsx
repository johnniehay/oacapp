import { getPayload } from "payload"
import configPromise from '@payload-config'
import { hasPermission } from "@/lib/permissions";
import { Group, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

export default async function Page({ params: paramsPromise }: { params: Promise<{ userid?: string }> }){
  const hasperm = await hasPermission("view:users:basic") //TODO: maybe revisit permission
  if (!hasperm) return <h1>Unauthorized</h1>
  const { userid } = await paramsPromise
  if (!userid || userid.length !== 36) return <h1>Invalid userid</h1>
  const payload = await getPayload({ config: configPromise })
  const user = await payload.findByID({collection:"users",id:userid})
  const usercheckins = (await payload.find({collection:"checkin",pagination:false,sort:"createdAt",where:{user:{equals:user.id}}})).docs


  return (
    <Stack>
      <Title order={1}>{user.name}</Title>
      <Title order={2}>App Role: {user.role}</Title>
      <Title order={2}><Link style={{color: "revert", textDecoration: "revert"}} href={`mailto:${user.email}`}>{user.email}</Link></Title>
      {usercheckins.map(checkin => <Group key={checkin.id}>
        <Text>{typeof checkin.location !== "string" && checkin.location.name}</Text>
        <Text>{new Date(checkin.updatedAt).toLocaleTimeString([],{hour: '2-digit', minute: '2-digit',timeZoneName: undefined})}</Text>
      </Group>)}
    </Stack>)
}