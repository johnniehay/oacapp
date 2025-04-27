"use client"

import {
  Button,
  Checkbox,
  Combobox,
  Group,
  InputLabel,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title
} from "@mantine/core";
import { useRef, useState } from "react";
import ConsentBlock from "@/components/consent.mdx";
import { useAction } from "next-safe-action/hooks";
import { doCreateDayVisitor } from "@/app/(main_outer)/(main)/registration/day_visitors/day-visitor-reg-action";
import HiddenInput = Combobox.HiddenInput;

export default function DayVisitorRegistrationClient(props: {setupComplete?: () => void, userName?: string}) {
  const { setupComplete,userName } = props
  const [minorOrAdult, setMinorOrAdult] = useState("minor")
  const [feedback, setFeedback] = useState({color:"", message:""})
  const [name, setName] = useState(userName ?? "")
  const [parent, setParent] = useState("")
  const [phone, setPhone] = useState("")
  const [consent, setConsent] = useState(false)
  const [parking, setParking] = useState(false)
  const [nameErrors, setNameErrors] = useState("")
  const [parentErrors, setParentErrors] = useState("")
  const [phoneErrors, setPhoneErrors] = useState("")

  const formref = useRef<HTMLFormElement>(null);
  const { execute: docreatedayvisitor } = useAction(doCreateDayVisitor, {
    onSuccess: ({ data }) => {
      if (data?.result) {
        setFeedback({ color: "green", message: "Registration successful." });
        formref.current?.reset();
        if (setupComplete) setupComplete()
      }
      if (!data || !data.result) {
        setFeedback({ color: "red", message: `Registration failed:${data?.error}` });
      }
    },
    onError: (error) => {
      setNameErrors(error.error.validationErrors?.name?._errors?.join(" ") ?? "")
      setParentErrors(error.error.validationErrors?.parent?._errors?.join(" ") ?? "")
      setPhoneErrors(error.error.validationErrors?.phone?._errors?.join(" ") ?? "")
    }
  })
  return (
    <Stack>
      <form ref={formref} action={docreatedayvisitor} >
        { !setupComplete && <>
          <Title>Day Visitor Registration</Title>
          <Text>This form is for day visitors not associated with a team that will not be signing in to the app themselves.</Text>
          <Text>Day visitors that are going to be signing in to the app should not be registered using this form, they should sign in and completed the form presented on sign in</Text>
          <Text>If you signed into the App and selected Day Visitor during initial setup you are already registered, do not fill in this form again.</Text>
        </> }
        <ConsentBlock/>
        { feedback.message !== '' && <Text c={feedback.color}>{feedback.message}</Text>}
        <TextInput name={"name"} value={name} label="Visitor Name" error={nameErrors} onChange={(e) => {setName(e.target.value);setNameErrors("")}} pattern="[^ ]+ [^ ].*" title="Name requires at least First Name and Surname" required />
        <Group>
          <div>
            <InputLabel>Visitor Age</InputLabel>
            {/*<InputDescription></InputDescription>*/}
          </div>
          <SegmentedControl
            name="minorOrAdult"
            value={minorOrAdult}
            data={[
              {value:"minor",label:"Under 18 years old"},
              {value:"adult",label:"Over 18 years old"}
            ]}
            onChange={setMinorOrAdult}
          />
        </Group>
        {minorOrAdult==="minor" && <TextInput name="parent" label="Parent/Guardian Name" value={parent} error={parentErrors} onChange={(e) => {setParent(e.target.value);setParentErrors("")}} pattern="[^ ]+ [^ ].*" title="Name requires at least First Name and Surname" required />}
        {minorOrAdult==="minor" && <TextInput name="phone" label="Phone Number" value={phone} error={phoneErrors} onChange={(e) => {setPhone(e.target.value);setPhoneErrors("")}} description="Contact number for person supervising the minor at the event" pattern="\+?[0-9 ]+" title="Phone number only numbers and + allowed " required />}
        <Checkbox name="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} label="By checking this box I acknowledge that I have read, understand, and agree to this Consent to Participate and Release Agreement." required/>
        {minorOrAdult==="adult" && <Checkbox name="parking" checked={parking} onChange={(e) => setParking(e.target.checked)} label="Book a parking bay. Cost R65"/>}
        <HiddenInput name={"setuser"} value={setupComplete?"setup":"registration"}/>
        <Button type={"submit"}>Submit</Button>
      </form>
    </Stack>
  )
}