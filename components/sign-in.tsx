import { signIn } from "@/auth"
import { Button, Divider, Popover, PopoverDropdown, PopoverTarget, TextInput, Text } from "@mantine/core";
import Form from "next/form";
import GoogleSigninButton from "@/components/google/google-signin-button";

export default function SignIn({ className }: { className?: string }) {
  async function doGoogleSignIn() {
    "use server"
    await signIn("google")
  }

  async function doEmailSignIn(formData: FormData) {
    "use server"
    await signIn("nodemailer", formData)
  }

  const penv = process.env
  const hidegoogle: boolean = !!( penv.HIDE_AUTH_GOOGLE ?? false )

  return (
    // <form
    //   action={async () => {
    //     "use server"
    //     await signIn("google")
    //   }}
    // >
    //   <Button className={className} type="submit">Sign in with Google</Button>
    // @ts-expect-error Popover doesn't include className
    <Popover className={className} withArrow>
      <PopoverTarget>
        <Button>Sign in</Button>
      </PopoverTarget>
      <PopoverDropdown>
        <Form action={doEmailSignIn}>
          <TextInput name="email" label={"Email"} placeholder={"email@example.com"}/>
          <Button classNames={{root:"gsi-material-button",inner:"gsi-material-button-content-wrapper",label:"gsi-material-button-contents justify-center"}} type={"submit"} fullWidth>Sign in with email</Button>
        </Form>
        { !hidegoogle && <>
          <Divider mt="xs" label="or" labelPosition="center"/>
          <Text size={"sm"} fw={500}>For Volunteers only</Text>
          <GoogleSigninButton onClick={doGoogleSignIn} />
        </>}
      </PopoverDropdown>


    </Popover>
    // </form>
  )
}