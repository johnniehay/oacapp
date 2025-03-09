'use server'

import webpush from 'web-push'
import {auth} from "@/auth"
import {prisma} from "@/prisma";
import {NotificationSubscription} from "@prisma/client";



webpush.setVapidDetails(
    'https://dev.oac.cids.org.za/contact',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
)

// let subscription: webpush.PushSubscription | null = null

export async function subscribeUser(sub: webpush.PushSubscription, topic: string) {
    // subscription = sub
    console.log('Subscribe user: ', JSON.stringify(sub))
    const session = await auth()
    console.log('Session: ', JSON.stringify(session))
    await prisma.notificationSubscription.create({
        data: {
            endpoint: sub.endpoint,
            expirationTime: sub.expirationTime,
            keys_p256dh: sub.keys.p256dh,
            keys_auth: sub.keys.auth,
            topic: topic,
            userId : session?.user?.id
        },
    });
    // In a production environment, you would want to store the subscription in a database
    // For example: await db.subscriptions.create({ data: sub })
    return {success: true}
}

export async function unsubscribeUser(sub: webpush.PushSubscription | null) {
    console.log('Unsubscribe user: ', JSON.stringify(sub))
    if (sub !== null)
        await prisma.notificationSubscription.delete({where: {endpoint: sub.endpoint}})
    // subscription = null

    // In a production environment, you would want to remove the subscription from the database
    // For example: await db.subscriptions.delete({ where: { ... } })
    return {success: true}
}

export async function sendNotification(message: string) {
    // if (!subscription) {
    //     throw new Error('No subscription available')
    // }
    const notifySubscriptions: NotificationSubscription[] = await prisma.notificationSubscription.findMany({where: {topic: ""}})
    const failedSubcriptions : webpush.PushSubscription[] = []
    for (const dbsubscription of notifySubscriptions) {
        const subscription: webpush.PushSubscription = {
            endpoint: dbsubscription.endpoint,
            keys: {
                p256dh: dbsubscription.keys_p256dh,
                auth: dbsubscription.keys_auth
            }
        }

        try {
            await webpush.sendNotification(
                subscription,
                JSON.stringify({
                    title: 'Test Notification',
                    body: message,
                    icon: '/icon.png',
                })
            )
            // return {success: true}
        } catch (error) {
            failedSubcriptions.push(subscription)
            console.error('Error sending push notification:', error, subscription)

        }
    }
    if (failedSubcriptions.length > 0) {
        return {success: false, error: 'Failed to send some notification(s)'}
    } else {
        return {success: true}
    }
}