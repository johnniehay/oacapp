"use client"

import { Button, Group, MultiSelect, Radio, RadioGroup, Select } from "@mantine/core";
import { useContext, useState } from "react";
import { doUserSetup } from "@/app/(main_outer)/setup/setup-actions";
import { ModalStateContext } from "@/components/modal";
import { useAction } from "next-safe-action/hooks";

type LabeledValue = {
  label:string,
  value:string
} ;
type LabeledValueOrString = LabeledValue | string
interface SetupClientProps {
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
  "volunteer":"Teams who want to see updates for",
  "":"Select above first"}

export function SetupClient(props: SetupClientProps) {
  const {teams, roleGroups, rolesbyGroup}: SetupClientProps = props
  const [selectedRoleGroup, setSelectedRoleGroup] = useState<string>("")
  const [roleGroupError, setRoleGroupError] = useState<string>("")
  const [roleError, setRoleError] = useState<string>("")
  const {close} = useContext(ModalStateContext)
  const { execute: dosetupaction } = useAction(doUserSetup,{onSuccess:close, onError:(error) => {
    setRoleGroupError(error.error.validationErrors?.roleGroup?._errors?.join(" ") ?? "")
    setRoleError(error.error.validationErrors?.role?._errors?.join(" ") ?? "")
  }})
  return <>
    <form action={dosetupaction}>
    <RadioGroup
      name="roleGroup"
      label="In what capacity will you be involved in the OAC?"
      value={selectedRoleGroup}
      error={roleGroupError}
      onChange={(e) => {setSelectedRoleGroup(e);setRoleGroupError("")}}
    >
      <Group mt="xs">
        {roleGroups.map((rolegroup) => {

          return (<Radio checked={rolegroup.value === selectedRoleGroup} key={rolegroup.value} value={rolegroup.value} label={rolegroup.label} />)}
        )}
      </Group>
    </RadioGroup>
    <Select name="role" label={"Role"} description={selectedRoleGroup in roleDescription && roleDescription[selectedRoleGroup]}
            error={roleError}
            onChange={() => {setRoleError("")}}
            data={rolesbyGroup[selectedRoleGroup]
    }/>
    <MultiSelect name="teamids" label={"Team"} description={selectedRoleGroup in teamDescription && teamDescription[selectedRoleGroup]}
            data={teams}/>
    <Button type={"submit"}>Submit</Button>
  </form>
  </>;
}