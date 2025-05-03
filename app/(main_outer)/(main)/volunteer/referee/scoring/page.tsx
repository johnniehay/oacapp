import ScoringClient from "@/app/(main_outer)/(main)/volunteer/referee/scoring/client";
import { Title } from "@mantine/core";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { hasPermission } from "@/lib/permissions";

export default async function Scoring() {
  const payload = await getPayload({config: configPromise})
  const eventconfig = await payload.findGlobal({slug:"eventconfig",})
  if (!eventconfig.robotgameForm) return <Title>Event RobotGame Form unset</Title>
  const form = (await hasPermission("view:scoring")) ? eventconfig.robotgameForm : undefined
  return <ScoringClient form={form}/>
}