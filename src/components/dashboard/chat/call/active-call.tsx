"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, MicOff, Phone, Video, VideoOff, Users, Maximize, Minimize } from "lucide-react";
import { useCall } from "@/context/call-context";
import * as OT from "opentok";

export function ActiveCall() {
  const { callState, endCall } = useCall();
  const { callType, isGroup, participants, sessionId } = callState;
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === "audio");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const publisherRef = useRef<HTMLDivElement>(null);
  const subscriberRefs = useRef<Record<string, HTMLDivElement>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [duration, setDuration] = useState(0);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    const publisher = OT.publishers.find((p) => p.element === publisherRef.current);
    if (publisher) {
      publisher.publishAudio(!isMuted);
    }
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    const publisher = OT.publishers.find((p) => p.element === publisherRef.current);
    if (publisher) {
      publisher.publishVideo(!isVideoOff);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const session = OT.sessions.find((s) => s.sessionId === sessionId);
    if (!session) return;

    session.on("streamCreated", (event: OT.Event<"streamCreated", OT.Session> & { stream: OT.Stream }) => {
      const subscriber = session.subscribe(
        event.stream,
        subscriberRefs.current[event.stream.streamId],
        {
          insertMode: "append",
          width: "100%",
          height: "100%",
        },
        (err: Error | undefined) => {
          if (err) console.error("Error subscribing to stream:", err);
        }
      );
      subscriber.on("videoDisabled", () => {
        // Handle video disabled
      });
    });

    session.on("streamDestroyed", () => {
      // Clean up subscriber
    });

    return () => {
      session.off("streamCreated");
      session.off("streamDestroyed");
    };
  }, [sessionId]);

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
    <div ref={containerRef} className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="p-4 flex items-center justify-between bg-black/50 text-white">
        <div>
          <h3 className="font-medium">{isGroup ? "Group Call" : participants[0]?.name}</h3>
          <p className="text-xs opacity-70">{formatDuration(duration)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        {callType === "video" ? (
          <div
            className={`grid gap-4 w-full h-full ${isGroup
              ? participants.length <= 2
                ? "grid-cols-1"
                : participants.length <= 4
                  ? "grid-cols-2"
                  : "grid-cols-3"
              : "grid-cols-1"
              }`}
          >
            <div className="relative bg-gray-800 rounded-lg overflow-hidden">
              <div
                ref={publisherRef}
                className={`w-full h-full object-cover ${isVideoOff ? "hidden" : "block"}`}
              />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs py-1 px-2 rounded">You</div>
            </div>

            {participants.map((participant: any) => (
              <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden">
                <div
                  ref={(el) => {
                    if (el) subscriberRefs.current[participant.id] = el;
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Avatar className="h-24 w-24">
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
                </div>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs py-1 px-2 rounded">
                  {participant.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            {isGroup ? (
              <div className="flex -space-x-4 mb-4">
                {participants.slice(0, 3).map((participant: any) => (
                  <Avatar key={participant.id} className="h-20 w-20 border-4 border-black">
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
                  <div className="h-20 w-20 rounded-full bg-gray-700 flex items-center justify-center border-4 border-black">
                    <span className="text-white font-medium">+{participants.length - 3}</span>
                  </div>
                )}
              </div>
            ) : (
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={participants[0]?.avatar || "/placeholder.svg"} />
                <AvatarFallback
                  style={{
                    backgroundColor: stringToColor(participants[0]?.id || ""),
                    color: "#fff",
                  }}
                >
                  {participants[0]?.name?.substring(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>
            )}
            <h2 className="text-xl font-bold text-white mb-2">
              {isGroup ? "Group Call" : participants[0]?.name || "Unknown"}
            </h2>
            <p className="text-white/70">{formatDuration(duration)}</p>
          </div>
        )}
      </div>

      <div className="p-6 bg-black/50 flex items-center justify-center gap-4">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full h-12 w-12 bg-white/10 border-0 text-white hover:bg-white/20"
          onClick={toggleMute}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        {callType === "video" && (
          <Button
            size="lg"
            variant="outline"
            className="rounded-full h-12 w-12 bg-white/10 border-0 text-white hover:bg-white/20"
            onClick={toggleVideo}
          >
            {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </Button>
        )}

        {isGroup && (
          <Button
            size="lg"
            variant="outline"
            className="rounded-full h-12 w-12 bg-white/10 border-0 text-white hover:bg-white/20"
          >
            <Users className="h-5 w-5" />
          </Button>
        )}

        <Button size="lg" variant="destructive" className="rounded-full h-12 w-12" onClick={endCall}>
          <Phone className="h-5 w-5 rotate-135" />
        </Button>
      </div>
    </div>
  );
}