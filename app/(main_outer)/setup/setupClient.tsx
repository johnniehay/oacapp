"use client"

import { Button, Group, MultiSelect, Radio, RadioGroup, Select, TextInput } from "@mantine/core";
import { ComponentPropsWithoutRef, ReactNode, useContext, useState } from "react";
import { doUserSetup } from "@/app/(main_outer)/setup/setup-actions";
import { ModalStateContext } from "@/components/modal";
import { useAction } from "next-safe-action/hooks";
import { dietaryOptions } from "@/payload/collections/People";
import PushNotificationSettingsClient from "@/components/push-notification-settings-client";
import { roleToNotificationTopicsMap } from "@/lib/role-to-notificationtopics";
import { type Role, RoleList } from "@/lib/roles";
import { useRouter } from "next/navigation";
import DayVisitorRegistrationClient from "@/app/(main_outer)/(main)/registration/day_visitors/client";
import { hidden } from "colorette";

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
  vapidPublicKey: string
}

const roleDescription: { [r:string]: string } = {
  "team":"What is your role within the Team?",
  "volunteer":"In what capacity will you be volunteering?",
  "":"Select above first"}

const teamDescription: { [r:string]: string } = {
  "team":"Team(s) who you are part of",
  "volunteer":"Optionally select any Teams you want to see updates for",
  "":"Select above first"}

function FormOrDiv({t,children,formprops}:{t:'form'|'div',children:ReactNode,formprops:ComponentPropsWithoutRef<'form'>}) {
  return t === 'form' ? <form {...formprops}>{children}</form> : <div>{children}</div>
}

export function SetupClient(props: SetupClientProps) {
  const {teams, roleGroups, rolesbyGroup, vapidPublicKey}: SetupClientProps = props
  const [selectedRoleGroup, setSelectedRoleGroup] = useState<string>("")
  const [userName, setUserName] = useState(props.user_name ?? "")
  const [role, setRole] = useState("default")
  const [roleGroupError, setRoleGroupError] = useState<string>("")
  const [roleError, setRoleError] = useState<string>("")
  const [teamidsError, setTeamidsError] = useState<string>("")
  const [dietaryError, setDietaryError] = useState<string>("")
  const {close} = useContext(ModalStateContext)
  const router = useRouter()
  function refeshAndClose() {
    router.refresh()
    close()
  }
  const { execute: dosetupaction } = useAction(doUserSetup,{
    onSuccess:refeshAndClose,
    onError:(error) => {
      const errteamids = error.error.validationErrors?.teamids 
      setRoleGroupError(error.error.validationErrors?.roleGroup?._errors?.join(" ") ?? "")
      setRoleError(error.error.validationErrors?.role?._errors?.join(" ") ?? "")
      setTeamidsError(errteamids && "_errors" in errteamids ? errteamids?._errors?.join(" ") ?? "" : "")
      setDietaryError(error.error.validationErrors?.dietary?._errors?.join(" ") ?? "")
  }})

  return (<>
    <FormOrDiv t={selectedRoleGroup === "day_visitor"?"div":"form"} formprops={{action:dosetupaction}}>
    <RadioGroup
      name="roleGroup"
      label="In what capacity will you be involved in the OAC?"
      value={selectedRoleGroup}
      error={roleGroupError}
      onChange={(e) => {setSelectedRoleGroup(e);setRoleGroupError("");if (e==="day_visitor") setRole("day_visitor")}}
      required
    >
      <Group mt="xs">
        {roleGroups.map((rolegroup) => {

          return (<Radio checked={rolegroup.value === selectedRoleGroup} key={rolegroup.value} value={rolegroup.value} label={rolegroup.label} />)}
        )}
      </Group>
    </RadioGroup>
      {selectedRoleGroup.length > 0 && selectedRoleGroup !== "day_visitor" && <>
        <TextInput name="user_name" label="Your Name" description="Preffered name you wish to use at OAC, will also be printed on lanyard" value={userName} onChange={(e) => setUserName(e.target.value)} />
        <Select name="role" label={"Role"} description={selectedRoleGroup in roleDescription && roleDescription[selectedRoleGroup]}
            error={roleError}
            onChange={(e) => {setRole(e??"default"); setRoleError("")}}
            data={rolesbyGroup[selectedRoleGroup]}
            required
    />
    <MultiSelect name="teamids" label={"Team"} description={selectedRoleGroup in teamDescription && teamDescription[selectedRoleGroup]}
            data={teams} error={teamidsError} required={selectedRoleGroup==="team"}/>
    {selectedRoleGroup==="team" && <Select styles={{root:{display:role === "day_visitor"?"none":""}}} name="dietary" label={"Dietary Requirement"} value={role === "day_visitor"?'None':undefined} error={dietaryError} data={dietaryOptions} required></Select>}
      </>}
      {selectedRoleGroup === "day_visitor" && <>
        For day vistors associated with a team select Team above and set Role to Day Visitor
        <DayVisitorRegistrationClient userName={userName} setupComplete={refeshAndClose}/>
        {/*<Select name="role" value={"day_visitor"} data={["day_visitor"]} hidden/>*/}
      </>}
      <PushNotificationSettingsClient visibleTopics={RoleList.includes(role as Role) ? roleToNotificationTopicsMap[role as Role] : roleToNotificationTopicsMap["default"]} vapidPublicKey={vapidPublicKey}/>
      {selectedRoleGroup !== "day_visitor" && <Button type={"submit"}>Submit</Button>}
    </FormOrDiv>
    {/*<PushNotificationSettingsClient visibleTopics={["event-broadcast","event-updates", "all"]}/>*/}
    {/*<PushNotificationSettingsClient visibleTopics={role in roleToNotificationTopicsMap ? roleToNotificationTopicsMap[role as keyof typeof roleToNotificationTopicsMap] : roleToNotificationTopicsMap["default"]}/>*/}
  </>);
}