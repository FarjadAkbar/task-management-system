"use client";

import { useEffect, useRef, useState } from "react";
import OT from "@opentok/client";
import API from "@/lib/axios-client";
import { useToast } from "@/hooks/use-toast";

export function useVonage(userId: string, roomId?: string) {
    const [session, setSession] = useState<OT.Session | null>(null);
    const [publisher, setPublisher] = useState<OT.Publisher | null>(null);
    const [subscribers, setSubscribers] = useState<OT.Subscriber[]>([]);
    const sessionRef = useRef<OT.Session | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (!roomId || !userId) return;

        let isMounted = true;

        const initSession = async () => {
            try {
                const response = await API.post("/vonage/session", { roomId, callType: "video" });
                const { sessionId, token, apiKey } = response.data;

                if (!isMounted) return;

                const vonageSession = OT.initSession(apiKey, sessionId);
                sessionRef.current = vonageSession;
                setSession(vonageSession);

                vonageSession.on("streamCreated", (event) => {
                    if (!isMounted) return;
                    const subscriber = vonageSession.subscribe(event.stream, undefined, {
                        insertMode: "append",
                        width: "100%",
                        height: "100%",
                    });
                    setSubscribers((prev) => [...prev, subscriber]);
                });

                vonageSession.on("streamDestroyed", (event) => {
                    if (!isMounted) return;
                    setSubscribers((prev) => prev.filter((sub) => sub.stream?.streamId !== event.stream.streamId));
                });

                vonageSession.connect(token, (error) => {
                    if (error || !isMounted) {
                        console.error("Vonage session connect error:", error);
                        toast({
                            title: "Connection Error",
                            description: "Failed to connect to call server",
                            variant: "destructive",
                        });
                        return;
                    }

                    const pub = OT.initPublisher(undefined, {
                        insertMode: "append",
                        width: "100%",
                        height: "100%",
                    });
                    vonageSession.publish(pub, (pubError) => {
                        if (pubError) {
                            console.error("Vonage publish error:", pubError);
                            toast({
                                title: "Publish Error",
                                description: "Failed to publish stream",
                                variant: "destructive",
                            });
                        }
                    });
                    setPublisher(pub);
                });
            } catch (error) {
                console.error("Error initializing Vonage session:", error);
                toast({
                    title: "Session Error",
                    description: "Failed to initialize call session",
                    variant: "destructive",
                });
            }
        };

        initSession();

        return () => {
            isMounted = false;
            if (sessionRef.current) {
                sessionRef.current.disconnect();
                setSession(null);
                setPublisher(null);
                setSubscribers([]);
            }
        };
    }, [roomId, userId, toast]);

    return { session, publisher, subscribers };
}