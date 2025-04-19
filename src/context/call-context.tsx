"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import * as OT from "opentok";
import { useCreateVonageSessionMutation } from "@/service/chats";
import API from "@/lib/axios-client";

type CallType = "audio" | "video";

interface CallState {
  isIncoming: boolean;
  isOutgoing: boolean;
  isActive: boolean;
  isGroup: boolean;
  callType: CallType;
  roomId: string | null;
  participants: any[];
  caller: any | null;
  sessionId: string | null;
  token: string | null;
}

interface CallContextType {
  callState: CallState;
  startCall: (roomId: string, participants: any[], callType: CallType, isGroup: boolean) => void;
  answerCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
  incomingCall: (caller: any, roomId: string, callType: CallType, isGroup: boolean, participants: any[], sessionId: string, token: string) => void;
}

const initialCallState: CallState = {
  isIncoming: false,
  isOutgoing: false,
  isActive: false,
  isGroup: false,
  callType: "audio",
  roomId: null,
  participants: [],
  caller: null,
  sessionId: null,
  token: null,
};

const CallContext = createContext<CallContextType | undefined>(undefined);

export function CallProvider({
  children,
  user,
  apiKey,
}: {
  children: React.ReactNode;
  user: any;
  apiKey: string;
}) {
  const [callState, setCallState] = useState<CallState>(initialCallState);
  const { toast } = useToast();
  const sessionRef = useRef<OT.Session | null>(null);
  const publisherRef = useRef<OT.Publisher | null>(null);
  const { mutateAsync: createVonageSession } = useCreateVonageSessionMutation();

  const cleanupCall = () => {
    if (publisherRef.current) {
      publisherRef.current.destroy();
      publisherRef.current = null;
    }
    if (sessionRef.current) {
      sessionRef.current.disconnect();
      sessionRef.current = null;
    }
  };

  const resetCallState = () => {
    setCallState(initialCallState);
  };

  const startCall = async (roomId: string, participants: any[], callType: CallType, isGroup: boolean) => {
    try {
      const { sessionId, token } = await createVonageSession({ roomId });
      const session = OT.initSession(apiKey, sessionId);
      sessionRef.current = session;

      const publisher = OT.initPublisher(undefined, {
        publishAudio: true,
        publishVideo: callType === "video",
        name: user.name || user.email,
      });
      publisherRef.current = publisher;

      await new Promise<void>((resolve, reject) => {
        session.connect(token, (err: Error | undefined) => {
          if (err) reject(err);
          else resolve();
        });
      });

      await new Promise<void>((resolve, reject) => {
        session.publish(publisher, (err: Error | undefined) => {
          if (err) reject(err);
          else resolve();
        });
      });

      setCallState({
        isIncoming: false,
        isOutgoing: true,
        isActive: false,
        isGroup,
        callType,
        roomId,
        participants,
        caller: null,
        sessionId,
        token,
      });

      await API.post("/chat/messages", {
        content: `${user.name} started a ${callType} call`,
        roomId,
      });

      toast({
        title: "Calling...",
        description: isGroup ? "Starting group call" : `Calling ${participants[0]?.name}`,
      });
    } catch (error) {
      console.error("Error starting call:", error);
      toast({
        title: "Call Failed",
        description: "Could not start the call",
        variant: "destructive",
      });
      cleanupCall();
      resetCallState();
    }
  };

  const incomingCall = (
    caller: any,
    roomId: string,
    callType: CallType,
    isGroup: boolean,
    participants: any[],
    sessionId: string,
    token: string
  ) => {
    setCallState({
      isIncoming: true,
      isOutgoing: false,
      isActive: false,
      isGroup,
      callType,
      roomId,
      participants,
      caller,
      sessionId,
      token,
    });
  };

  const answerCall = async () => {
    try {
      if (!callState.sessionId || !callState.token) {
        throw new Error("Session ID or token missing");
      }

      const session = OT.initSession(apiKey, callState.sessionId);
      sessionRef.current = session;

      const publisher = OT.initPublisher(undefined, {
        publishAudio: true,
        publishVideo: callState.callType === "video",
        name: user.name || user.email,
      });
      publisherRef.current = publisher;

      await new Promise<void>((resolve, reject) => {
        session.connect(callState.token, (err: Error | undefined) => {
          if (err) reject(err);
          else resolve();
        });
      });

      await new Promise<void>((resolve, reject) => {
        session.publish(publisher, (err: Error | undefined) => {
          if (err) reject(err);
          else resolve();
        });
      });

      setCallState((prev) => ({
        ...prev,
        isIncoming: false,
        isActive: true,
      }));

      await API.post("/chat/messages", {
        content: `${user.name} joined the call`,
        roomId: callState.roomId,
      });
    } catch (error) {
      console.error("Error answering call:", error);
      toast({
        title: "Call Failed",
        description: "Could not join the call",
        variant: "destructive",
      });
      cleanupCall();
      resetCallState();
    }
  };

  const rejectCall = async () => {
    if (callState.roomId) {
      await API.post("/chat/messages", {
        content: `${user.name} rejected the call`,
        roomId: callState.roomId,
      });
    }

    cleanupCall();
    resetCallState();
  };

  const endCall = async () => {
    if (callState.roomId) {
      await API.post("/chat/messages", {
        content: `${user.name} ended the call`,
        roomId: callState.roomId,
      });
    }

    cleanupCall();
    resetCallState();
  };

  useEffect(() => {
    return () => {
      cleanupCall();
    };
  }, []);

  return (
    <CallContext.Provider
      value={{
        callState,
        startCall,
        answerCall,
        rejectCall,
        endCall,
        incomingCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export const useCall = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
};