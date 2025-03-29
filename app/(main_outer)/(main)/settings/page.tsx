import { ColorSchemesSwitcher } from "@/components/color-schemes-switcher";
import PushNotificationSettings from "@/components/push-notification-settings";
import InstallPrompt from "@/components/install-prompt";


export default function Settings() {
  return (<>
    <div className="flex justify-center mt-10">
      <ColorSchemesSwitcher/>
    </div>
    <PushNotificationSettings/>

    <InstallPrompt/>
  </>)
}
