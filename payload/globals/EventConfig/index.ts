import { GlobalConfig } from "payload";
import { checkPermission } from "@/payload/access/checkPermission";

export const EventConfig: GlobalConfig = {
  slug: "eventconfig",
  access: {
    read: checkPermission("admin"),
    update: checkPermission("admin")
  },
  fields: [
    {name: "eventtime", label: "Event Time", type: "date", admin:{date:{pickerAppearance: "dayAndTime", timeFormat: "HH:mm", timeIntervals: 5,displayFormat:"EEE do MMM HH:mm"}} },
    {name: "robotgameForm", label: "RobotGame Form", type:"text" },
    {name: "judgingForm", label: "Judging Form", type:"text"},
    {name: "coachesAwardForm", label: "Coaches Award nomination form link", type:"text"},
    {name: "instagramLink", label:"Competition Instagram link", type:"text"},
    {name: "dayvisitorparking", label: "Day Visitor Parking Count", type:"number",required:true,defaultValue:0}
  ]
}