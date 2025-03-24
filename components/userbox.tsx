import { auth } from "@/auth";
import SignIn from "@/components/sign-in";
import { Avatar, Button, Text } from "@mantine/core";
import { ClientModal } from "@/components/modal";
import SetupPage from "@/app/(main_outer)/setup/page";

export default async function Userbox({ className }: { className?: string }) {
  const session = await auth()
  if (!session || !session.user) return <SignIn className={className}/>
  console.log(session.user, session.user.role)
  let opensetup = false
  if (!session.user.role || session.user.role === "") {
    opensetup = true
  }
  return (<>
    <Button variant="outline"
            className={className}
            rightSection={<Avatar src={session.user.image} alt={session.user.name ?? "Null User"} radius="xl"
                                  size={20}/>}>
      <Text fw={500} size="sm" lh={1} mr={3}>
        {session.user.name}
      </Text>
    </Button>
    { opensetup &&
      <ClientModal startopened={opensetup} title={"Account Setup"}>
        <SetupPage />
      </ClientModal>
    }
    </>
  )
}