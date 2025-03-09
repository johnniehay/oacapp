'use client'

import { useState, useEffect, ChangeEvent, useContext } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from './push-subscribe-actions'
import { Button, Fieldset, Group, MultiSelect, Switch, TextInput } from "@mantine/core";
import { subscribeContext } from "@/components/client-shell";


function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  // const [subscription, setSubscription] = useState<PushSubscription | null>(
  //   null
  // )
  const { subscription, setSubscription } = useContext(subscribeContext)
  const [message, setMessage] = useState('')
  const [topic, setTopic] = useState('')

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      // registerServiceWorker()
      console.log('Push notification manager')
    }
  }, [])

  // async function registerServiceWorker() {
  //   const registration = await navigator.serviceWorker.register('/sw.js', {
  //     scope: '/',
  //     updateViaCache: 'none',
  //   })
  //   const sub = await registration.pushManager.getSubscription()
  //   setSubscription(sub)
  // }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)
    const serializedSub = JSON.parse(JSON.stringify(sub))
    await subscribeUser({ sub: serializedSub, topic })
  }

  async function unsubscribeFromPush() {
    setSubscription(null)
    const serializedSub = JSON.parse(JSON.stringify(subscription))
    await unsubscribeUser({ sub: serializedSub })
    await subscription?.unsubscribe()
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification({ message })
      setMessage('')
    }
  }

  async function handleOnChangeSubscribed(event: ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.checked) {
      await subscribeToPush()
    } else {
      await unsubscribeFromPush()
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>
  }

  return (
    <div>
      <Fieldset legend="Push Notifications">
        <Switch
          defaultChecked={!!subscription}
          labelPosition="left"
          label="Subscribe to Push Notifications"
          onLabel="Subcribed"
          offLabel="Unsubcribed"
          onChange={(event) => handleOnChangeSubscribed(event)}
          description={subscription ? "You are subscribed to push notifications." : "You are not subscribed to push notifications."}
        />
        {subscription ? (
          <>

            {/*<p>You are subscribed to push notifications.</p>*/}
            {/*<button onClick={unsubscribeFromPush}>Unsubscribe</button>*/}
            <Group>
              <TextInput
                placeholder="Enter notification message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button onClick={sendTestNotification}>Send Test</Button>
            </Group>
          </>
        ) : (
          <>
            {/*<p>You are not subscribed to push notifications.</p>*/}
            {/*<button onClick={subscribeToPush}>Subscribe</button>*/}
            <MultiSelect
              placeholder="Enter push topic"
              data={['team', '1111', '1001', 'volunteer', 'all']}
              value={topic.split(':')}
              onChange={(e) => setTopic(e.join(":"))}
            />

          </>
        )}
      </Fieldset>
    </div>
  )
}

