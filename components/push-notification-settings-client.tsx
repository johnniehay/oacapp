'use client'

import { useState, useEffect, ChangeEvent, useContext, useRef } from 'react'
import {
  subscribeUser,
  unsubscribeUser,
  sendNotification,
  getSubscriptionTopics,
  setSubscriptionTopics
} from './push-subscribe-actions'
import {
  Button, Collapse, Divider,
  Fieldset,
  Group, InputDescription,
  InputLabel,
  MultiSelect,
  SegmentedControl,
  Switch,
  TextInput
} from "@mantine/core";
import { subscribeContext } from "@/components/client-shell";
import type { NotificationTopic, NotificationTopics } from "@/lib/types";
import { IconChevronDown } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";



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


export default function PushNotificationSettingsClient({ visibleTopics, vapidPublicKey }: { visibleTopics: NotificationTopics, vapidPublicKey:string }) {
  const [isSupported, setIsSupported] = useState(false)
  // const [subscription, setSubscription] = useState<PushSubscription | null>(
  //   null
  // )
  const { subscription, setSubscription } = useContext(subscribeContext)
  const [message, setMessage] = useState('')
  const [topics, setTopics] = useState<NotificationTopics>([])
  const lastTopics = useRef<NotificationTopics>([])
  const [open, {toggle}] = useDisclosure(false)


  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      // registerServiceWorker()
      console.log('Push notification manager')
    }
  }, [])

  useEffect(() => {
    if (!subscription) {
      console.log('subscription null when trying to fetch topics')
    } else {
      const serializedSub = JSON.parse(JSON.stringify(subscription))
      getSubscriptionTopics({ sub: serializedSub }).then((v) => {
        if (v && "validationErrors" in v) {
          console.error("Unable to load subscribed topics", v)
        } else if (v && v.data) {
          console.log('topics fetched', v.data)
          lastTopics.current = v.data
          setTopics(v.data)
        }
      })
    }
  }, [subscription]);

  useEffect(() => {
    console.log('topics changed')
    if (!subscription) {
      console.log('topics changed but subscription null')
      return
    }
    if (topics === lastTopics.current) {
      console.log('topics unchanged, skipping update')
      return
    }
    const serializedSub = JSON.parse(JSON.stringify(subscription))
    setSubscriptionTopics({ sub: serializedSub, topics }).then((acres) => {
      const setres = acres?.data
      if (setres) {
        if ("validationErrors" in setres) {
          console.error("Unable to set subscribed topics", setres)
        } else {
          if ("failed" in setres) {
            console.log('subscribed topics update failed', setres)
            // subscribeUser(serializedSub).then(r => {})
          } else if ("success" in setres) {
            console.log('subscribed topics updated', setres)
            lastTopics.current = setres.success
          }
        }
      }
    })
  }, [topics]);

  // async function registerServiceWorker() {
  //   const registration = await navigator.serviceWorker.register('/sw.js', {
  //     scope: '/',
  //     updateViaCache: 'none',
  //   })
  //   const sub = await registration.pushManager.getSubscription()
  //   setSubscription(sub)
  // }

  async function subscribeToPush(subscribetopics?: NotificationTopics) {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        vapidPublicKey
      ),
    })
    setSubscription(sub)
    const serializedSub = JSON.parse(JSON.stringify(sub))
    await subscribeUser({ sub: serializedSub, topics: subscribetopics ?? topics })
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

  async function handleOnChangeSubscribeAll(value: string) {
    if (value === "all") {

      if (!subscription) {
        await subscribeToPush(visibleTopics)
      }
      setTopics(visibleTopics)
    }
    if (value === "off") {
      if (topics.length > 0) {
        setTopics([])
      }
      await unsubscribeFromPush()
    }
  }

  function handleOnChangeSubscribedSwitch(changetopic:NotificationTopic) {
    // console.log("Building Switch",changetopic)
    return async (event: ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget.checked) {
        const newTopics = [...topics,changetopic]
        // setTopics(newTopics)
        if (!subscription) {
          await subscribeToPush( newTopics )
        }
        setTopics(newTopics)
      } else {
        setTopics(topics.filter((topic) => topic !== changetopic && topic !== "all"))
      }
    }
  }

  const subscriptionSwitchvalue = !subscription ? "off" : (topics.includes("all") ? "all" : "some")

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>
  }

  return (
    <>
      <Fieldset legend="Push Notifications (recommended)">
        {/*<Switch*/}
        {/*  // defaultChecked={!!subscription}*/}
        {/*  checked={!!subscription}*/}
        {/*  labelPosition="left"*/}
        {/*  label="Push Notifications"*/}
        {/*  onLabel="ON"*/}
        {/*  offLabel="OFF"*/}
        {/*  onChange={(event) => handleOnChangeSubscribed(event)}*/}
        {/*  description={subscription ? "You are subscribed to push notifications." : "You are not subscribed to push notifications."}*/}
        {/*/>*/}
        <Group>
          <div>
            <InputLabel>Push Notifications</InputLabel>
            <InputDescription>{subscription ? "You are subscribed to push notifications." : "You are not subscribed to push notifications."}</InputDescription>
          </div>
          <SegmentedControl
            value={subscriptionSwitchvalue}
            data={[
            {value:"off",label:"Off"},
            subscriptionSwitchvalue === "some" && {value:"some",label:"Some",disabled:true},
            {value:"all",label:"All"}].filter(v => !!v)}
            color={subscriptionSwitchvalue === "all" ? "green" : (subscriptionSwitchvalue === "off" ? "red" : "")}
            onChange={handleOnChangeSubscribeAll}
          />
        </Group>
        <Divider label={<IconChevronDown/>} onClick={toggle} />
        <Collapse in={open}>
        {visibleTopics.includes("event-updates") &&
          <Switch
            checked={topics.includes("event-updates")}
            onChange={handleOnChangeSubscribedSwitch("event-updates")}
            labelPosition="left"
            label="Event Information Update Notifcations"
          />
        }
        {visibleTopics.includes("event-broadcast") &&
          <Switch
            checked={topics.includes("event-broadcast")}
            onChange={handleOnChangeSubscribedSwitch("event-broadcast")}
            labelPosition="left"
            label="Event Broadcast Notifcations"
          />
        }
        {visibleTopics.includes("team") &&
          <Switch
            checked={topics.includes("team")}
            onChange={handleOnChangeSubscribedSwitch("team")}
            labelPosition="left"
            label="Team Notifcations"
            description={"Team specific messages and reminders for Robot Rounds or Judging"}
          />
        }
        {visibleTopics.includes("volunteer") &&
          <Switch
            checked={topics.includes("volunteer")}
            onChange={handleOnChangeSubscribedSwitch("volunteer")}
            labelPosition="left"
            label="Volunteer Notifcations"
          />
        }

        {visibleTopics.includes("test") &&
          <>
            <Switch
              checked={topics.includes("test")}
              onChange={handleOnChangeSubscribedSwitch("test")}
              labelPosition="left"
              label="Test Notifcations"
            />
            <Group>
              <TextInput
                placeholder="Enter notification message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button onClick={sendTestNotification}>Send Test</Button>
            </Group>

            {/*<p>You are not subscribed to push notifications.</p>*/}
            {/*<button onClick={subscribeToPush}>Subscribe</button>*/}
            <MultiSelect
              placeholder="Enter push topic"
              data={['team', '1111', '1001', 'volunteer', 'all']}
              value={topics}
              onChange={(e) => setTopics(e as NotificationTopics)}
            />
          </>}
        </Collapse>
      </Fieldset>
    </>
  )
}

