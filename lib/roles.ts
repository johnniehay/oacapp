export const VolunteerPermissions = ["view:team:details:basic","view:volunteer", "view:schedule:robotgame", "view:schedule:judgingroom"] as const

export const NonPublicPermissions = ["view:nonpublic"] as const

export const BaseTeamPermissions = [...NonPublicPermissions] as const
export const CoachPermissions = [...NonPublicPermissions] as const
export const AllTeamPermissions = [...BaseTeamPermissions,...CoachPermissions] as const

export const PagesPermissions = ["all:pages","create:media","all:forms"] as const
export const UpdateManagementPermissions = ["create:update","update:update","remove:update"] as const
export const EventManagementPermissions = ["create:event","update:event","remove:event"] as const
export const LocationManagementPermissions = ["create:location","update:location","remove:location"] as const
export const CheckinManagementPermissions = ["create:checkin","update:checkin","remove:checkin", "view:checkin"] as const
export const PeopleManagementPermissions = ["create:people", "update:people", "remove:people", "view:people"] as const

export const MCPermissions = ["view:queuing:status"] as const
export const TechnicalPermissions = ["view:queuing:status", "view:checkin", "view:judging", "view:scoring"]
export const QueuerPermissions = ["view:queuing:status", "checkin:robotgame","checkin:judgingroom", "checkin:queuing", ...VolunteerPermissions]
export const ScoreKeeperPermissions = ["view:score:resubmit", "view:scoring", ...QueuerPermissions, ...VolunteerPermissions]
export const RefereePermissions = ["view:schedule:robotgame", "checkin:robotgame","view:score:submissions", "view:scoring", "view:score:resubmit", ...VolunteerPermissions] as const
export const JudgePermissions = ["view:schedule:judgingroom", "checkin:judgingroom", "view:judging", ...VolunteerPermissions] as const
export const JudgeAdvisorPermissions = [...JudgePermissions, "view:judgingroom:status", "update:judgingroom:judges"] as const
export const FieldManagerPermissions = [ "update:location", ...RefereePermissions, ...QueuerPermissions, ...VolunteerPermissions] as const
export const TeamAssistPermissions = ["view:team:details", "view:checkin", "view:people", ...VolunteerPermissions] as const
export const TeamAdminAssistPermissions = ["view:users","update:team", "view:team:details", "view:checkin", ...TeamAssistPermissions, ...PeopleManagementPermissions, ...PagesPermissions, ...UpdateManagementPermissions, ...VolunteerPermissions] as const
export const TeamAdminPermissions = ["view:users", "update:user:role", "create:team", "update:location", ...TeamAdminAssistPermissions] as const
export const VolunteerAssistPermissions = ["view:users", "view:checkin", "view:people", ...TeamAssistPermissions, ...VolunteerPermissions] as const
export const VolunteerAdminPermissions = ["update:user:role", "update:location", ...TeamAdminAssistPermissions, ...VolunteerAssistPermissions, ...VolunteerPermissions] as const
export const EventOrganizerPermissions = ["update:user:role", "create:team", "update:location", ...TeamAdminAssistPermissions, ...QueuerPermissions , ...VolunteerPermissions] as const
export const AdminOnlyPermissions = ["admin", "remove:team", "view:users", "create:users", "update:users", "remove:users",...EventManagementPermissions,...LocationManagementPermissions,...CheckinManagementPermissions] as const
export const AdminPermissions = [...AdminOnlyPermissions, ...VolunteerAdminPermissions, ...JudgeAdvisorPermissions, ...FieldManagerPermissions, ...TeamAdminPermissions] as const
export const AllPermissions = [...VolunteerAdminPermissions, ...JudgeAdvisorPermissions, ...FieldManagerPermissions, ...TeamAdminPermissions, ...AdminPermissions, ...AllTeamPermissions, ...NonPublicPermissions] as const
export type Permission = typeof AllPermissions[number]
export type PermissionList = readonly Permission[]

export const VolunteerRoleList = ["volunteer", "technical", "queuer", "referee", "judge", "judge_advisor", "mc", "score_keeper", "field_manager", "event_organizer", "team_assist", "team_admin_assist", "team_admin", "volunteer_assist", "volunteer_admin"] as const
export type VolunteerRole = typeof VolunteerRoleList[number]

export const RoleList = [
  "default",// default empty role
  "candidate",// default setup pending confirmation
  "day_visitor",
  "coach" ,"mentor", "supporter", "translator", "team_member",
  ...VolunteerRoleList, "admin" ] as const
// when changing the above also update roleToNotificationTopicsMap in components/push-notification-settings.tsx

export type Role = typeof RoleList[number]
export const rolePermissions: Record<Role, PermissionList> = {
  "coach": CoachPermissions,
  "mentor":BaseTeamPermissions,
  "supporter":BaseTeamPermissions,
  "translator":BaseTeamPermissions,
  "team_member":BaseTeamPermissions,

  "volunteer": VolunteerPermissions,
  "volunteer_assist": VolunteerAssistPermissions,
  "technical": TechnicalPermissions,
  "team_assist":TeamAssistPermissions,
  "team_admin_assist":TeamAdminAssistPermissions,
  "queuer": QueuerPermissions,
  "mc": MCPermissions,
  "score_keeper": ScoreKeeperPermissions,
  "referee": RefereePermissions,
  "judge": JudgePermissions,
  "judge_advisor": JudgeAdvisorPermissions,
  "field_manager": FieldManagerPermissions,
  "event_organizer": EventOrganizerPermissions,
  "team_admin": TeamAdminPermissions,
  "volunteer_admin": VolunteerAdminPermissions,
  "admin": AllPermissions,

  "day_visitor": NonPublicPermissions,
  "candidate": NonPublicPermissions,
  "default": NonPublicPermissions
} as const