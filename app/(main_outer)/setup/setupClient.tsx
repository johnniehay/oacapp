"use client"

import { Button, Group, MultiSelect, Radio, RadioGroup, Select, TextInput } from "@mantine/core";
import { useContext, useState } from "react";
import { doUserSetup } from "@/app/(main_outer)/setup/setup-actions";
import { ModalStateContext } from "@/components/modal";
import { useAction } from "next-safe-action/hooks";
import { dietaryOptions } from "@/payload/collections/People";
import PushNotificationSettingsClient from "@/components/push-notification-settings-client";
import { roleToNotificationTopicsMap } from "@/lib/role-to-notificationtopics";
import { type Role, RoleList } from "@/lib/roles";
import { useRouter } from "next/navigation";

type LabeledValue = {
  label:string,
  value:string
} ;
type LabeledValueOrString = LabeledValue | string
interface SetupClientProps {
  user_name: string|null|undefined;
  teams: LabeledValueOrString[]
  roleGroups: LabeledValue[]
  rolesbyGroup: {[rolegroup:string]:LabeledValueOrString[]}
}

const roleDescription: { [r:string]: string } = {
  "team":"What is your role within the Team?",
  "volunteer":"In what capacity will you be volunteering?",
  "":"Select above first"}

const teamDescription: { [r:string]: string } = {
  "team":"Team(s) who you are part of",
  "volunteer":"Optionally select any Teams you want to see updates for",
  "":"Select above first"}

export function SetupClient(props: SetupClientProps) {
  const {teams, roleGroups, rolesbyGroup}: SetupClientProps = props
  const [selectedRoleGroup, setSelectedRoleGroup] = useState<string>("")
  const [userName, setUserName] = useState(props.user_name ?? "")
  const [role, setRole] = useState("default")
  const [roleGroupError, setRoleGroupError] = useState<string>("")
  const [roleError, setRoleError] = useState<string>("")
  const [teamidsError, setTeamidsError] = useState<string>("")
  const [dietaryError, setDietaryError] = useState<string>("")
  const {close} = useContext(ModalStateContext)
  const router = useRouter()
  const { execute: dosetupaction } = useAction(doUserSetup,{
    onSuccess:() => {
      router.refresh()
      close()
    },
    onError:(error) => {
      setRoleGroupError(error.error.validationErrors?.roleGroup?._errors?.join(" ") ?? "")
      setRoleError(error.error.validationErrors?.role?._errors?.join(" ") ?? "")
      setTeamidsError(error.error.validationErrors?.teamids?._errors?.join(" ") ?? "")
      setDietaryError(error.error.validationErrors?.dietary?._errors?.join(" ") ?? "")
  }})
  return (<>
    <form action={dosetupaction}>
      <TextInput name="user_name" label="Your Name" description="Preffered name you wish to use at OAC, will also be printed on lanyard" value={userName} onChange={(e) => setUserName(e.target.value)} />
    <RadioGroup
      name="roleGroup"
      label="In what capacity will you be involved in the OAC?"
      value={selectedRoleGroup}
      error={roleGroupError}
      onChange={(e) => {setSelectedRoleGroup(e);setRoleGroupError("")}}
      required
    >
      <Group mt="xs">
        {roleGroups.map((rolegroup) => {

          return (<Radio checked={rolegroup.value === selectedRoleGroup} key={rolegroup.value} value={rolegroup.value} label={rolegroup.label} />)}
        )}
      </Group>
    </RadioGroup>
    <Select name="role" label={"Role"} description={selectedRoleGroup in roleDescription && roleDescription[selectedRoleGroup]}
            error={roleError}
            onChange={(e) => {setRole(e??"default"); setRoleError("")}}
            data={rolesbyGroup[selectedRoleGroup]}
            required
    />
    <MultiSelect name="teamids" label={"Team"} description={selectedRoleGroup in teamDescription && teamDescription[selectedRoleGroup]}
            data={teams} error={teamidsError} required={selectedRoleGroup==="team"}/>
    {selectedRoleGroup==="team" && <Select name="dietary" label={"Dietary Requirement"} error={dietaryError} data={dietaryOptions} required></Select>}
      <PushNotificationSettingsClient visibleTopics={RoleList.includes(role as Role) ? roleToNotificationTopicsMap[role as Role] : roleToNotificationTopicsMap["default"]}/>
      <Button type={"submit"}>Submit</Button>
    </form>
    {/*<PushNotificationSettingsClient visibleTopics={["event-broadcast","event-updates", "all"]}/>*/}
    {/*<PushNotificationSettingsClient visibleTopics={role in roleToNotificationTopicsMap ? roleToNotificationTopicsMap[role as keyof typeof roleToNotificationTopicsMap] : roleToNotificationTopicsMap["default"]}/>*/}
  </>);
}