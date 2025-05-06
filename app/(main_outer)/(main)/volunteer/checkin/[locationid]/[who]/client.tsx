"use client"

import { useContext, useEffect } from "react";
import { QRmodalContext } from "@/app/(main_outer)/(main)/scanner-testing/qrscanner";
import { doVolunteerCheckin } from "@/app/(main_outer)/(main)/volunteer/checkin/[locationid]/[who]/server-action";
import { Who } from "@/app/(main_outer)/(main)/checkin/[locationid]/[who]/page";


export default function VolunteerCheckinClient({ who, locationid, serverurl}: {who: Who, locationid:string, serverurl: string}) {
  const { qrtext } = useContext(QRmodalContext)
  useEffect(() => {
    if (qrtext && qrtext !== "" && qrtext.startsWith(serverurl)) {
      const checkinparams: {teamid?: string, personid?: string, userid?: string } = {}
      if (qrtext.startsWith(serverurl+'/person/')) {
        checkinparams.personid = qrtext.split('/')[4]
      }
      if (qrtext.startsWith(serverurl+'/user/')) {
        checkinparams.userid = qrtext.split('/')[4]
      }

      doVolunteerCheckin({ who, locationid, ...checkinparams })
    }
  }, [locationid, qrtext, serverurl, who])
  return (<></>)

}