import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

import TicketsView from "@/components/dashboard/tickets/TicketsView";
import SuspenseLoading from "@/components/loadings/suspense";

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
