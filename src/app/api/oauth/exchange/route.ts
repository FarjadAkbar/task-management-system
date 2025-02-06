import { prismadb } from "@/lib/prisma";
import { requireUser } from "@/lib/user";
import { nylas, nylasConfig } from "@/lib/nylas";

import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("Received callback from Nylas");
  const user = await requireUser();
  const url = new URL(req.url as string);
  const code = url.searchParams.get("code");
  console.log(code, "code");
  
  if (!code) {
    return Response.json("No authorization code returned from Nylas", {
      status: 400,
    });
  }
  const codeExchangePayload = {
    clientSecret: nylasConfig.apiKey,
    clientId: nylasConfig.clientId as string,
    redirectUri: nylasConfig.callbackUri,
    code,
  };

  try {
    const response = await nylas.auth.exchangeCodeForToken(codeExchangePayload);
    const { grantId, email } = response;

    await prismadb.users.update({
      where: {
        id: user?.id as string,
      },
      data: {
        grantId: grantId,
        grantEmail: email,
      },
    });

    user.grantId = grantId;

    console.log({ grantId });
  } catch (error) {
    console.error("Error exchanging code for token:", error);
  }

  redirect("/event");
}