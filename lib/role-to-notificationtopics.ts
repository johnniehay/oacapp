import type { Role } from "@/lib/roles";
import type { NotificationTopics } from "@/lib/types";


type RoleToNotificationTopicsMap = Record<Role, NotificationTopics>;
export const defaultNotifcationTopics: NotificationTopics = ["event-broadcast","event-updates", "all"]
export const roleToNotificationTopicsMap: RoleToNotificationTopicsMap = {
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