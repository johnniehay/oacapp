"use server";

import { z } from "zod";
import { authActionClient, optionalAuthActionClient } from "@/lib/safe-action";
import webpush from 'web-push'
import { prisma } from "@/prisma";
import { NotificationSubscription } from "@prisma/client";

// This schema is used to validate input from client.


webpush.setVapidDetails(
  'https://dev.oac.cids.org.za/contact',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)
const schemaPushSubscription = z.object({
  endpoint: z.string(),
  expirationTime: z.number().nullable(),
  keys: z.object({
    p256dh: z.string().length(87),
    auth: z.string().length(22),
  }),
})
// type zPushSubscription = z.infer<typeof schemaPushSubscriptionMan>
// const schemaPushSubscription = z.custom<webpush.PushSubscription>
const schemaPushSubscriptionTopic = z.object({
  sub: schemaPushSubscription,
  topic: z.string().max(100),
});

export const subscribeUser = optionalAuthActionClient
  .metadata({ actionName: "subscribeUser" })
  .schema(schemaPushSubscriptionTopic)
  .action(async ({ parsedInput: { sub, topic }, ctx: { session } }) => {
    // .action(async ({ parsedInput: {sub, topic}, ctx: {session}}) =>
    //     subscribeUser(sub,topic,session))
// async function subscribeUser(sub: webpush.PushSubscription, topic: string, session) {
    // subscription = sub
    console.log('Subscribe user: ', JSON.stringify(sub))
    // const session = await auth()
    console.log('Session: ', JSON.stringify(session))
    await prisma.notificationSubscription.create({
      data: {
        endpoint: sub.endpoint,
        expirationTime: sub.expirationTime,
        keys_p256dh: sub.keys.p256dh,
        keys_auth: sub.keys.auth,
        topic: topic,
        userId: session?.user?.id
      },
    });
    // In a production environment, you would want to store the subscription in a database
    // For example: await db.subscriptions.create({ data: sub })
    return { success: true }
  })
export const unsubscribeUser = optionalAuthActionClient
  .metadata({ actionName: "unsubscribeUser" })
  .schema(z.object({ sub: schemaPushSubscription }))
  .action(async ({ parsedInput: { sub }, ctx: { session } }) => {
// export async function unsubscribeUser(sub: webpush.PushSubscription | null) {
    console.log('Unsubscribe user: ', JSON.stringify(sub))
    const userId = session?.user?.id

    const dbsubscription = await prisma.notificationSubscription.findFirst({ where: { endpoint: sub.endpoint } })
    if (dbsubscription?.userId) {
      if (dbsubscription.userId !== userId) {
        // allow deletion of subscription with userid only by that user
        return { success: false }
      }
    }

    await prisma.notificationSubscription.delete({ where: { endpoint: sub.endpoint } })
    // subscription = null

    // In a production environment, you would want to remove the subscription from the database
    // For example: await db.subscriptions.delete({ where: { ... } })
    return { success: true }
  })

export const sendNotification = authActionClient
  .metadata({ actionName: "sendNotification: " })
  .schema(z.object({ message: z.string() }))
  .action(async ({ parsedInput: { message } }) => {
// export async function sendNotification(message: string) {
    // if (!subscription) {
    //     throw new Error('No subscription available')
    // }
    const notifySubscriptions: NotificationSubscription[] = await prisma.notificationSubscription.findMany({ where: { topic: { contains: "" } } })
    console.log("notifySubscriptions", notifySubscriptions)
    const failedSubcriptions: webpush.PushSubscription[] = []
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
        await prisma.notificationSubscription.delete({ where: { endpoint: subscription.endpoint } })
      }
    }
    if (failedSubcriptions.length > 0) {
      return { success: false, error: 'Failed to send some notification(s)' }
    } else {
      return { success: true }
    }
  })
