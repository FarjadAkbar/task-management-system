// AdminWrapper.tsx (Server Component)
import { useSession } from "next-auth/react"
import { ReactNode } from "react";

interface AdminWrapperProps {
    children: ReactNode;
}

export default function AdminWrapper({ children }: AdminWrapperProps) {
    const { data: session, status } = useSession();
    if (session?.user.role !== "ADMIN") return null;
    return <>{children}</>;
}
