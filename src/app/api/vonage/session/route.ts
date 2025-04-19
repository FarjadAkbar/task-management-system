import { NextResponse } from "next/server";
import OpenTok from "opentok";

const apiKey = process.env.VONAGE_API_KEY;
const apiSecret = process.env.VONAGE_API_SECRET;

export async function POST() {
    try {
        if (!apiKey || !apiSecret) {
            return NextResponse.json(
                { message: "Vonage API key or secret is missing" },
                { status: 500 }
            );
        }

        const opentok = new OpenTok(apiKey, apiSecret);

        return new Promise((resolve) => {
            opentok.createSession({ mediaMode: "routed" }, (err: Error | null, session?: OpenTok.Session | undefined) => {
                if (err || !session) {
                    console.error("Error creating Vonage session:", err);
                    resolve(
                        NextResponse.json(
                            { message: "Failed to create session", error: err?.message || "Unknown error" },
                            { status: 500 }
                        )
                    );
                    return;
                }

                const token = opentok.generateToken(session.sessionId, {
                    role: "publisher",
                    expireTime: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
                });

                resolve(
                    NextResponse.json({
                        message: "Session created",
                        sessionId: session.sessionId,
                        token,
                        apiKey,
                    })
                );
            });
        });
    } catch (error) {
        console.error("Error in Vonage session API:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: (error as Error).message },
            { status: 500 }
        );
    }
}