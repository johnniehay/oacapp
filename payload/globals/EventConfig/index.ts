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
    {name: "judgingForm", label: "Judging Form", type:"text"}
  ]
}