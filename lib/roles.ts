export const VolunteerPermissions = ["view:team:details:basic","view:volunteer"] as const

export const NonPublicPermissions = ["view:nonpublic"] as const

export const BaseTeamPermissions = [...NonPublicPermissions] as const
export const CoachPermissions = ["view:people","update:people",...NonPublicPermissions] as const
export const AllTeamPermissions = [...BaseTeamPermissions,...CoachPermissions] as const

export const PagesPermissions = ["all:pages","create:media","all:forms"] as const
export const UpdateManagementPermissions = ["create:update","update:update","remove:update"] as const
export const EventManagementPermissions = ["create:event","update:event","remove:event"] as const

export const JudgePermissions = ["view:schedule:judgingroom", "checkin:judgingroom", ...VolunteerPermissions] as const
export const JudgeAdvisorPermissions = [...JudgePermissions, "view:judgingroom:status", "update:judgingroom:judges"] as const
export const FieldManagerPermissions = ["view:queuing:status", ...VolunteerPermissions] as const
export const TeamAdminPermissions = ["view:users","create:team","update:team", "view:team:details", "create:people", "remove:people", ...PagesPermissions, ...UpdateManagementPermissions, ...VolunteerPermissions] as const
export const VolunteerAdminPermissions = ["view:users", "update:user:role", ...VolunteerPermissions] as const
export const AdminOnlyPermissions = ["admin", "remove:team", "view:users", "create:users", "update:users", "remove:users",...EventManagementPermissions] as const
export const AdminPermissions = [...AdminOnlyPermissions, ...VolunteerAdminPermissions, ...JudgeAdvisorPermissions, ...FieldManagerPermissions, ...TeamAdminPermissions] as const
export const AllPermissions = [...VolunteerAdminPermissions, ...JudgeAdvisorPermissions, ...FieldManagerPermissions, ...TeamAdminPermissions, ...AdminPermissions, ...AllTeamPermissions, ...NonPublicPermissions] as const
export type Permission = typeof AllPermissions[number]
export type PermissionList = readonly Permission[]

export const RoleList = [
  "default",// default empty role
  "coach" ,"mentor", "supporter", "team_member",
  "judge", "judge_advisor", "field_manager", "team_admin", "volunteer_admin", "admin" ] as const

export type Role = typeof RoleList[number]
export const rolePermissions: Record<Role, PermissionList> = {
  "coach": CoachPermissions,
  "mentor":BaseTeamPermissions,
  "supporter":BaseTeamPermissions,
  "team_member":BaseTeamPermissions,

  "judge": JudgePermissions,
  "judge_advisor": JudgeAdvisorPermissions,
  "field_manager": FieldManagerPermissions,
  "team_admin": TeamAdminPermissions,
  "volunteer_admin": VolunteerPermissions,
  "admin": AllPermissions,
  "default": NonPublicPermissions
} as const