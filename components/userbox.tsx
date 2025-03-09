import { auth } from "@/auth";
import SignIn from "@/components/sign-in";
import { Avatar, Button, Text } from "@mantine/core";

export default async function Userbox({ className }: { className?: string }) {
  const session = await auth()
  if (!session || !session.user) return <SignIn className={className}/>
  return (
    <Button variant="outline"
            className={className}
            rightSection={<Avatar src={session.user.image} alt={session.user.name ?? "Null User"} radius="xl"
                                  size={20}/>}>
      <Text fw={500} size="sm" lh={1} mr={3}>
        {session.user.name}
      </Text>
    </Button>
  )
}