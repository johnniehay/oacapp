import { ColorSchemesSwitcher } from "@/components/color-schemes-switcher";
import PushNotificationManager from "@/components/push-notification-manager";
import InstallPrompt from "@/components/install-prompt";


export default function Settings() {
  return (<>
    <div className="flex justify-center mt-10">
      <ColorSchemesSwitcher/>
    </div>
    <PushNotificationManager/>

    <InstallPrompt/>
  </>)
}
