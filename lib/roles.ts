export const VolunteerPermissions = ["view:team:details:basic"] as const

export const NonPublicPermissions = ["view:nonpublic"] as const

export const JudgePermissions = ["view:schedule:judgingroom", "checkin:judgingroom", ...VolunteerPermissions] as const
export const JudgeAdvisorPermissions = [...JudgePermissions, "view:judgingroom:status", "change:judgingroom:judges"] as const
export const FieldManagerPermissions = ["view:queuing:status", ...VolunteerPermissions] as const
export const TeamAdminPermissions = ["update:team:details", "view:team:details", ...VolunteerPermissions] as const
export const VolunteerAdminPermissions = ["change:user:role", ...VolunteerPermissions] as const
export const AdminPermissions = [...VolunteerAdminPermissions, ...JudgeAdvisorPermissions, ...FieldManagerPermissions, ...TeamAdminPermissions] as const
export const AllPermissions = [...VolunteerAdminPermissions, ...JudgeAdvisorPermissions, ...FieldManagerPermissions, ...TeamAdminPermissions, ...AdminPermissions, ...NonPublicPermissions] as const
export type Permission = typeof AllPermissions[number]
export type PermissionList = readonly Permission[]

export const rolePermissions: { [key: string]: PermissionList } = {
  "Judge": JudgePermissions,
  "JudgeAdvisor": JudgeAdvisorPermissions,
  "FieldManager": FieldManagerPermissions,
  "TeamAdmin": TeamAdminPermissions,
  "VolunteerAdmin": VolunteerPermissions,
  "Admin": AllPermissions,
} as const
export type Roles = keyof typeof rolePermissions