"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, PhoneOff, Video } from "lucide-react";
import { useCall } from "@/context/call-context";

export function IncomingCall() {
  const { callState, answerCall, rejectCall } = useCall();
  const { caller, callType, isGroup, participants } = callState;

  useEffect(() => {
    const audio = new Audio("/sounds/ringtone.mp3");
    audio.loop = true;
    audio.play().catch((e) => console.error("Could not play ringtone:", e));

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
        <h2 className="text-xl font-bold mb-2">{isGroup ? "Incoming Group Call" : "Incoming Call"}</h2>
        <p className="text-muted-foreground mb-6">{callType === "video" ? "Video Call" : "Audio Call"}</p>

        <div className="flex justify-center mb-6">
          {isGroup ? (
            <div className="flex -space-x-4">
              {participants.slice(0, 3).map((participant: any) => (
                <Avatar key={participant.id} className="h-16 w-16 border-4 border-white">
                  <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                  <AvatarFallback
                    style={{
                      backgroundColor: stringToColor(participant.id),
                      color: "#fff",
                    }}
                  >
                    {participant.name?.substring(0, 2) || "U"}
                  </AvatarFallback>
                </Avatar>
              ))}
              {participants.length > 3 && (
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center border-4 border-white">
                  <span className="text-sm font-medium">+{participants.length - 3}</span>
                </div>
              )}
            </div>
          ) : (
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src={caller?.avatar || "/placeholder.svg"} />
              <AvatarFallback
                style={{
                  backgroundColor: stringToColor(caller?.id || ""),
                  color: "#fff",
                }}
              >
                {caller?.name?.substring(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        <h3 className="text-lg font-semibold">
          {isGroup ? caller?.name + " started a group call" : caller?.name || "Unknown Caller"}
        </h3>

        <div className="flex justify-center gap-6 mt-8">
          <Button size="lg" variant="destructive" className="rounded-full h-16 w-16" onClick={rejectCall}>
            <PhoneOff className="h-6 w-6" />
          </Button>
          <Button
            size="lg"
            variant="default"
            className="rounded-full h-16 w-16 bg-green-500 hover:bg-green-600"
            onClick={answerCall}
          >
            {callType === "video" ? <Video className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
          </Button>
        </div>
      </div>
    </div>
  );
}