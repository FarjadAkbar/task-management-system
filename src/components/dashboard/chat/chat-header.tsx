"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCall } from "@/context/call-context";
import { Info, Phone, Video } from "lucide-react";
import { InfoSidebar } from "./info-sidebar";

interface ChatHeaderProps {
  room: any;
  currentUserId: string;
}

export function ChatHeader({ room, currentUserId }: ChatHeaderProps) {
  const { startCall } = useCall();
  const [showInfo, setShowInfo] = useState(false);

  if (!room) return null;

  const otherParticipants = room.participants.filter((p: any) => p.id !== currentUserId);

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

  const handleAudioCall = () => {
    startCall(room.id, otherParticipants, "audio", room.isGroup);
  };

  const handleVideoCall = () => {
    startCall(room.id, otherParticipants, "video", room.isGroup);
  };

  return (
    <>
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {room.isGroup ? (
            <Avatar className="h-10 w-10">
              <AvatarFallback style={{ backgroundColor: stringToColor(room.id || "group"), color: "#fff" }}>
                {room.name?.substring(0, 2) || "GR"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherParticipants[0]?.avatar || "/placeholder.svg"} />
              <AvatarFallback style={{ backgroundColor: stringToColor(room.id || "user"), color: "#fff" }}>
                {otherParticipants[0]?.name?.substring(0, 2) || "DM"}
              </AvatarFallback>
            </Avatar>
          )}

          <div>
            <h3 className="font-medium">{room.name}</h3>
            <p className="text-xs text-muted-foreground">
              {room.isGroup ? `${room.participants.length} participants` : "Online"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            className="bg-green-500 hover:bg-green-600 text-white rounded-full h-8 w-8"
            onClick={handleAudioCall}
            title="Audio Call"
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full h-8 w-8"
            onClick={handleVideoCall}
            title="Video Call"
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full h-8 w-8"
            onClick={() => setShowInfo(true)}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {showInfo && (
        <InfoSidebar
          room={room}
          userList={room.participants.map((p: any) => ({
            id: p.id,
            name: p.name,
            email: p.email,
            avatar: p.avatar,
          }))}
          onClose={() => setShowInfo(false)}
        />
      )}
    </>
  );
}