import { getPayload, Where } from "payload";
import { Event, Location } from "@/payload-types"
import configPromise from "@payload-config";

export async function getEventsForLocation({location, numPast = 5, numFuture = 2}: {location: Location | string, numPast?: number, numFuture?: number}) {
  const payload = await getPayload({config: configPromise})
  const eventconfig = await payload.findGlobal({slug:"eventconfig",})
  if (!eventconfig.eventtime) throw Error('EventTime not set')
  const currEventTime = new Date(eventconfig.eventtime)
  const currentEvents = (await payload.find({collection:"event", depth:1, where:{and:[{location:{equals:location}},{"end":{"greater_than":currEventTime}}, {"start":{"less_than_equal":currEventTime}}]}})).docs
  const current = currentEvents.length > 0 ? currentEvents[0] : null
  const past = (await payload.find({collection:"event", depth:1,limit:numPast, sort:"-start", where:{and:[{location:{equals:location}},{"end":{"less_than":currEventTime}}]}})).docs.reverse()
  const future = (await payload.find({collection:"event", depth:1,limit:numFuture, sort:"start", where:{and:[{location:{equals:location}},{"start":{"greater_than":currEventTime}}]}})).docs
  return {past, current, future }
}