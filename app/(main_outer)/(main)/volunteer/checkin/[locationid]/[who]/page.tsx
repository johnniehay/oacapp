import { getLocalPayloadSession } from "@/lib/payload-authjs-custom/payload/session/getLocalPayloadSession";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { QRScanButton, QRScannerModalProvider, QRTextbox } from "@/app/(main_outer)/(main)/scanner-testing/qrscanner";

import VolunteerCheckinClient from "@/app/(main_outer)/(main)/volunteer/checkin/[locationid]/[who]/client";
import { getServerUrl } from "@/lib/payload-authjs-custom/payload/session/getPayloadSession";
import { Who } from "@/app/(main_outer)/(main)/checkin/[locationid]/[who]/page";

type Args = {
  params: Promise<{
    locationid: string
    who: Who | string
  }>
}

const wholist = ['team','person','volunteer'] as const
function isWho(inputwho: Who | string): inputwho is Who {
  return !!inputwho && (wholist as readonly string[]).includes(inputwho)
}

function nullifID<T>(value: T|string): T|null {
  return (typeof value === 'string') ? null : value
}


export default async function Checkin({ params: paramsPromise }: Args) {
  const { locationid, who } = await paramsPromise
  if (!locationid || locationid.length !== 24) return <h1>Invalid location</h1>
  if (!isWho(who)) return <h1>Invalid who</h1>

  const session = await getLocalPayloadSession()
  if (!session) return <h1>Unauthorized to check in when not signed in</h1>
  const payload = await getPayload({ config: configPromise })
  const location = await payload.findByID({ collection: "location", id: locationid, depth: 1, disableErrors: true })
  if (!location) return <h1>Location not found</h1>
  const serverurl = await getServerUrl()


  return (<QRScannerModalProvider fps={15} startopened={true} showTorchButtonIfSupported showZoomSliderIfSupported
                                  defaultZoomValueIfSupported={8}>
    <QRTextbox/>
    <QRScanButton/>
    <VolunteerCheckinClient who={who} locationid={location.id} serverurl={serverurl}/>
  </QRScannerModalProvider>)
}