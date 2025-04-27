import { getPayload, RequiredDataFromCollection } from "payload"
import config from '@payload-config'
import { Event, Location } from "@/payload-types"
import { parse } from "csv-parse";
import { flushAndExit } from "next/dist/telemetry/flush-and-exit";
// import { difference } from "next/dist/build/utils";
// import { add, parse as dateparse } from "date-fns";

const seed = async () => {
  // Get a local copy of Payload by passing your config
  const args = process.argv.slice(2)
  const dryrunarg = args.includes("dryrun") || args.includes("dry-run")
  const payload = await getPayload({ config })
  const generaleventquery = (await payload.find({
    collection: "event",
    pagination: false,
    limit: 0,
    where: { eventType: { equals: "general" } }
  }))
  function eventidx(event:Event) {
    return `${event.title}#${new Date(event.start).toDateString()}`
  }
  const eventcachebytitleanddate = generaleventquery.docs.reduce((accum: { [key: string]: Event }, event) => {
    const eventindex = eventidx(event)
    return { ...accum, [eventindex]: event }
  }, {})

  const locationquery = await payload.find({ collection: "location", pagination: false })
  const locationcache = locationquery.docs.reduce((accum: { [key: string]: Location }, location) => {
    return { ...accum, [location.name]: location }
  }, {})

  type LocationData = Omit<Location, "id" | "updatedAt" | "createdAt">
  // const rgloc = ["A", "B", "C", "D", "E", "F", "G", "H"].reduce((accum: { [key: string]: LocationData }, abbr) => {
  //   return {
  //     ...accum,
  //     [`Table ${abbr}`]: { name: `Table ${abbr}`, abbreviation: abbr, location_type: "robotgame" } as LocationData
  //   }
  // }, {})
  // const judgloc = [1, 2, 3, 4, 5, 6, 7, 8].reduce((accum: { [key: string]: LocationData }, abbr) => {
  //   return {
  //     ...accum,
  //     [`Room ${abbr}`]: { name: `Room ${abbr}`, abbreviation: `Room ${abbr}`, location_type: "judging" } as LocationData
  //   }
  // }, {})
  // const minlocations: { [key: string]: LocationData } = { ...rgloc, ...judgloc }
  // const missinglocations = difference(Object.keys(minlocations), Object.keys(locationcache))
  // for (const loc of missinglocations) {
  //   locationcache[loc] = await payload.create({ collection: "location", data: minlocations[loc] });
  // }
  const parser = process.stdin.pipe(parse({
    columns:(header) => header, //.map((col:string) => col.replace(' ','').replace('#','')),
    on_record: async (record, context) => {
      console.log(record)
      console.log(context)
      console.log("dryrunarg",dryrunarg)
      const dryrun = dryrunarg || false

      if (!(record.location in locationcache)) {
        const locdata = {name: record.location, abbreviation: record.location, location_type: "general"} as LocationData
        if (dryrun) {
          locationcache[record.location] = {id: record.location/*dummy*/, ...locdata} as Location
          console.log("would add Location", locationcache[record.location]);
        } else {
          locationcache[record.location] = await payload.create({ collection: "location", data: locdata });
          console.log("added Location", locationcache[record.location]);
        }
      }

      const eventstartdate = new Date(record.start)//dateparse(record.start, 'y-MM-dd HH:mm:ss', new Date())
      const eventenddate = new Date(record.end)//dateparse(record.end, 'y-MM-dd HH:mm:ss', new Date())
      const retrecpart: { event: RequiredDataFromCollection<Event> } = {
        event: {
          eventType: "general",
          start: eventstartdate.toISOString(),
          end: eventenddate.toISOString(),
          title: record.title,
          location: locationcache[record.location].id,
          forAll: record.for_all.length > 0 ? [record.for_all] : ['volunteers','teams'],
        }
      }


      if (eventidx(retrecpart.event as Event) in eventcachebytitleanddate) {
        console.warn("Skipping existing event, not updating")
      } else {
        if (dryrun || retrecpart.event.title === retrecpart.event.location) {
          if (retrecpart.event.title === retrecpart.event.location)
            console.log("Skipping event whose location has not been added")
          console.log("Would add new event", retrecpart.event)
        } else {
          const newevent = (await payload.create({ collection: "event", data: retrecpart.event }))
          console.log("Added event", newevent)
        }
      }

    const retrec = retrecpart
      return retrec
    }
  }))
  for await (const record of parser) {
    console.log(record)
  }
}

// Call the function here to run your seed script
await seed()
console.log("done")
await flushAndExit(0)