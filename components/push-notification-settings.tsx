import { getLocalPayloadSession } from "@/lib/payload-authjs-custom/payload/session/getLocalPayloadSession";
// import { getPayload } from "payload";
// import config from "@payload-config"
import { NotificationTopics } from "@/lib/types";
import { Role } from "@/lib/roles";
import PushNotificationSettingsClient from "@/components/push-notification-settings-client";
import { getRoleFromUser } from "@/lib/get-role";

type RoleToNotificationTopicsMap = Record<Role, NotificationTopics>;
const defaultNotifcationTopics: NotificationTopics = ["event-broadcast","event-updates", "all"]
const roleToNotificationTopicsMap: RoleToNotificationTopicsMap = {
  "coach": ["team",...defaultNotifcationTopics],
  "mentor":["team",...defaultNotifcationTopics],
  "supporter":["team",...defaultNotifcationTopics],
  "translator":["team",...defaultNotifcationTopics],
  "team_member":["team",...defaultNotifcationTopics],
  "volunteer":["volunteer",...defaultNotifcationTopics],
  "judge": ["volunteer",...defaultNotifcationTopics],
  "judge_advisor": ["volunteer",...defaultNotifcationTopics],
  "field_manager": ["team","volunteer",...defaultNotifcationTopics],
  "team_admin": ["team","volunteer",...defaultNotifcationTopics],
  "volunteer_admin": ["volunteer",...defaultNotifcationTopics],
  "admin": ["test","team","volunteer",...defaultNotifcationTopics],
  "candidate":defaultNotifcationTopics,
  "default":defaultNotifcationTopics
};

export default async function PushNotificationSettings() {
  const session = await getLocalPayloadSession()
  // const payload = await getPayload({ config })
  let notificationtopics: NotificationTopics = defaultNotifcationTopics
  const userRole = getRoleFromUser(session?.user)
  if (userRole) {
    notificationtopics = roleToNotificationTopicsMap[userRole]
  }
  return (<PushNotificationSettingsClient visibleTopics={notificationtopics}/>)
}