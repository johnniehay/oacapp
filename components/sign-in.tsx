import { signIn } from "@/auth"
import {Button, Divider, Popover, PopoverDropdown, PopoverTarget, TextInput} from "@mantine/core";
import Form from "next/form";

export default function SignIn({className} : {  className?: string }) {
    async function doGoogleSignIn() {
        "use server"
        await signIn("google")
    }
    async function doEmailSignIn(formData: FormData) {
        "use server"
        await signIn("email",formData)
    }
  return (
    // <form
    //   action={async () => {
    //     "use server"
    //     await signIn("google")
    //   }}
    // >
    //   <Button className={className} type="submit">Sign in with Google</Button>
      <Popover className={className} withArrow>
          <PopoverTarget>
              <Button >Sign in</Button>
          </PopoverTarget>
          <PopoverDropdown>
              <Button onClick={doGoogleSignIn} fullWidth>Sign in with Google</Button>
              <Divider mt="xs" label="or" labelPosition="center" />
              <Form action={doEmailSignIn}>
                  <TextInput name="email" label={"Email"} placeholder={"email@example.com"} />
                  <Button type={"submit"} fullWidth>Sign in with email</Button>
              </Form>
          </PopoverDropdown>


      </Popover>
    // </form>
  )
}