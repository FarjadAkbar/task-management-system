"use client"

import { useCall } from "@/context/call-context"
import { IncomingCall } from "./incoming-call"
import { OutgoingCall } from "./outgoing-call"
import { ActiveCall } from "./active-call"

export function CallManager() {
  const { callState } = useCall()
  const { isIncoming, isOutgoing, isActive } = callState

  if (!isIncoming && !isOutgoing && !isActive) {
    return null
  }

  if (isIncoming) {
    return <IncomingCall />
  }

  if (isOutgoing) {
    return <OutgoingCall />
  }

  if (isActive) {
    return <ActiveCall />
  }

  return null
}
