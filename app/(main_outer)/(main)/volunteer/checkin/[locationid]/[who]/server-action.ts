"use server"

import { z } from "zod";
import { authActionClient } from "@/lib/safe-action";
import { checkin } from "@/lib/checkin";

const volunteerCheckinSchema = z.object({
  who:  z.union([z.literal('team'),z.literal('person'),z.literal('volunteer')]),
  locationid: z.string().length(24),
  userid: z.string().length(36).optional(),
  teamid: z.string().length(24).optional(),
  personid: z.string().length(24).optional(),
}).refine(({ userid, teamid, personid }) => userid || teamid || personid,
  {
    path: ["team"],
    message: "Select either user or team or person",
  })

export const doVolunteerCheckin = authActionClient
  .metadata({ actionName: "doVolunteerCheckin" })
  .schema(volunteerCheckinSchema)
  .action(async ({ parsedInput: { who, locationid, userid:inputuserid,teamid,personid }, ctx: { user, payload } }) => {
    if (personid && !teamid) {
      const teamfromkrag = await payload.findByID(({collection:"people", id:personid}))
      teamid = teamfromkrag.id
    }
    console.log({ who, locationid, userid:inputuserid,teamid,personid })
    const checkedin = await checkin({ who, locationid, teamid, personid })
    return checkedin
  })
