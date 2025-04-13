import { GlobalConfig } from "payload";

export const EventConfig: GlobalConfig = {
  slug: "eventconfig",
  fields: [
    {name: "eventtime", label: "Event Time", type: "date", admin:{date:{pickerAppearance: "dayAndTime", timeFormat: "HH:mm", timeIntervals: 5,displayFormat:"EEE do MMM HH:mm"}} },
  ]
}