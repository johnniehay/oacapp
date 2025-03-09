import NextImage from "next/image";
import {Button, Card, CardSection, Image, Text} from "@mantine/core";
import {IconExternalLink} from "@tabler/icons-react";
import hotelData from "./hotel-data";

export function HotelCard({imageurl, hotelname, slug}: {imageurl: string, hotelname: string, slug: string}) {
    return (<Card>
        <CardSection>
            <Image src={imageurl} alt={hotelname} h="20rem" key={slug+":image"}/>
        </CardSection>

        <Button mt="md" rightSection={<IconExternalLink/>} key={slug+":linkbutton"}>
            <Text size="md" key={slug+":name"}>{hotelname}</Text>
        </Button>
    </Card>)
}

export function HotelCards(){

    return (
        <>
            {hotelData.map(hotel => (<HotelCard key={hotel.slug} {...hotel}/>))}
        </>
    )
}