import { auth, signOut } from "@/auth";
import SignIn from "@/components/sign-in";
import { Avatar, Button, Menu, MenuDropdown, MenuItem, MenuTarget, Select, Text } from "@mantine/core";
import { ClientModal } from "@/components/modal";
import SetupPage from "@/app/(main_outer)/setup/page";
import { getRoleFromUser, roleOverrides } from "@/lib/get-role";
import { RoleList } from "@/lib/roles";

export default async function Userbox({ className }: { className?: string }) {
  async function onChangeRoleOverride(value:string|null) {
    "use server"
    // const [value,_] = chg
    const session = await auth()
    if (!session || !session.user || !session.user.id || getRoleFromUser(session.user,true) !== "admin"){
      return {failed:"Unauthorized"}
    }
    console.log("roleOverride",value)
    if (!value) { //check in roleslist
      return {failed:"Invalid role"}
    }
    roleOverrides[session.user.id]=value
    return {success: {roleOverride:value}}
  }
  async function doSignOut(): Promise<void> {
    "use server"
    await signOut()
  }

  const session = await auth()
  if (!session || !session.user) return <SignIn className={className}/>
  console.log(session.user, session.user.role)
  let opensetup = false
  const userRole = getRoleFromUser(session.user)
  const realRole = getRoleFromUser(session.user,true)
  console.log("userRole", userRole)
  if (!userRole || userRole === "default") {
    opensetup = true
  }
  return (<>
    <Menu closeOnItemClick={false}>
      <MenuTarget>
        <Button variant="outline"
                className={className}
                rightSection={<Avatar src={session.user.image} alt={session.user.name ?? "Null User"} radius="xl"
                                      size={20}/>}>
          <Text fw={500} size="sm" lh={1} mr={3}>
            {session.user.name}
          </Text>
        </Button>
      </MenuTarget>
      <MenuDropdown>
        {realRole==="admin" && (
          <MenuItem closeMenuOnClick={false}>
            <Select label={"Override Role"} data={RoleList} onChange={onChangeRoleOverride} defaultValue={userRole}/>
          </MenuItem>
        )}
        <MenuItem onClick={doSignOut}>
          Logout
        </MenuItem>
      </MenuDropdown>
    </Menu>
    { opensetup &&
      <ClientModal startopened={opensetup} title={"Account Setup"}>
        <SetupPage />
      </ClientModal>
    }
    </>
  )
}