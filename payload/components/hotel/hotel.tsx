import NextImage, { StaticImageData } from "next/image";
import { Button, CardSection, Paper, SimpleGrid, Text, Title } from "@mantine/core";
import hotelData from "./hotel-data";
import { HotelCardClient } from "@/payload/components/hotel/hotelCardClient";
import { IconExternalLink } from "@tabler/icons-react";
import { Suspense } from "react";

export interface HotelData {
  imagedata: StaticImageData;
  hotelname: string;
  link: string;
  slug: string;
}

export function HotelCard(hotel: HotelData) {
  return (<>
    <HotelCardClient
      cardcontent={ <CardSection>
                      {/*<Image src={imageurl} alt={hotelname} h="20rem" key={slug + ":image"}/>*/}
                      <NextImage src={hotel.imagedata} alt={hotel.hotelname} className={"not-prose object-cover"}
                                 style={{ height: "20rem" }} key={hotel.slug + ":image"}/>
                    </CardSection>}
      cardbuttoncontent={<Text size="md" key={hotel.slug + ":name"}>{hotel.hotelname}</Text>}
      cardbuttonprops={{mt:"md", rightSection:<IconExternalLink/>}}
      modalprops={{title:hotel.hotelname, centered:true}}>
      <Suspense fallback={<NextImage src={hotel.imagedata} alt={hotel.hotelname} className={"not-prose object-cover"}
                 style={{ height: "20rem" }} key={hotel.slug + ":image"}/>}>
        <NextImage src={hotel.imagedata} alt={hotel.hotelname} className={"object-cover"}
                   style={{ height: "20rem" }} key={hotel.slug + ":image"}/>
          <Text>Other info here</Text>
        <Button component="a" href={hotel.link}  mt="md" rightSection={<IconExternalLink/>} key={hotel.slug + ":linkbutton"}>
          <Text size="md" key={hotel.slug + ":name"}>{hotel.hotelname}</Text>
        </Button>
      </Suspense>
    </HotelCardClient>
  </>)
}

export async function HotelCards() {

  return (
    <Paper shadow="lg" radius="md" p="sm" className={"not-prose"}>
      <Title>Hotels</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, lg:3, xl: 3 }}>
        {hotelData.map(hotel => (<HotelCard key={hotel.slug} {...hotel}/>))}
      </SimpleGrid>
    </Paper>
  )
}