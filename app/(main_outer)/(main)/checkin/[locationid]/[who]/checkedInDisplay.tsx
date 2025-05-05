import { Checkin } from "@/payload-types";
import { IconCheck } from "@tabler/icons-react";
import { Stack, Title } from "@mantine/core";
import { Who } from "@/app/(main_outer)/(main)/checkin/[locationid]/[who]/page";
import { asNotID } from "@/lib/checkin";


export default function CheckedInDisplay({checkin}: {checkin: Checkin}) {
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
    </Stack>)
}