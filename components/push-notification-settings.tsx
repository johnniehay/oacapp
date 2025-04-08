import { getLocalPayloadSession } from "@/lib/payload-authjs-custom/payload/session/getLocalPayloadSession";
import PushNotificationSettingsClient from "@/components/push-notification-settings-client";
import { getRoleFromUser } from "@/lib/get-role";
import { defaultNotifcationTopics, roleToNotificationTopicsMap } from "@/lib/role-to-notificationtopics";

export default async function PushNotificationSettings() {
  const session = await getLocalPayloadSession()
  let notificationtopics = defaultNotifcationTopics
  const userRole = getRoleFromUser(session?.user)
  if (userRole) {
    notificationtopics = roleToNotificationTopicsMap[userRole]
  }
  return (<PushNotificationSettingsClient visibleTopics={notificationtopics}/>)
}