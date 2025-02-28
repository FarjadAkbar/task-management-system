import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

import TicketsView from "./_components/TicketsView";
import SuspenseLoading from "@/components/loadings/suspense";

export const maxDuration = 300;

const TicketsPage = async () => {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) return redirect("/sign-in");

  return (
    <Suspense fallback={<SuspenseLoading />}>
      <TicketsView />
    </Suspense>
  );
};

export default TicketsPage;
