import { getLocalPayloadSession } from "@/lib/payload-authjs-custom/payload/session/getLocalPayloadSession";
import { getPayload } from "payload";
import config from '@payload-config'
import { Title } from "@mantine/core";
import { redirect } from "next/navigation";
import { SetupClient } from "@/app/(main_outer)/setup/setupClient";
import { peopleRoleOptions, volunteerRoleOptions } from "@/payload/collections/People";

export default async function Page() {
  const session = await getLocalPayloadSession()
  const payload = await getPayload({config})
  if (!session || !session.user) redirect("/api/auth/signin")
  const teamselect = (await payload.find({collection:"team",pagination:false,depth:0,sort:'name',select:{name:true,number:true}})).docs.map((t) => { return {label:t.name,value:t.id} });
  return (
    <div>
      <Title order={2}> Welcome {session.user.name ?? session.user.email} </Title>
      <Title order={3}> to get started we need the following information to complete your user setup</Title>

      <SetupClient
        user_name={session.user.name}
        roleGroups={[{ label: "Team", value: "team" }, { label: "Volunteer", value: "volunteer" }]}
        rolesbyGroup={{
          "team": peopleRoleOptions.filter((pr) => !pr.value.includes("candidate")),
          "volunteer": volunteerRoleOptions//["Judge", "Referee", { label: "Other Volunteer", value: "volunteer" }]
        }}
        teams={teamselect}
      />
    </div>
  )
}
