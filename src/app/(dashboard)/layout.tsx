import { redirect } from "next/navigation";
import { Metadata } from "next";
import Header from "./components/Header";
import { requireUser } from "@/lib/user";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL! || "http://localhost:3000"
  ),
  title: "",
  description: "",
  openGraph: {
    images: [
      {
        url: "/images/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/images/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "",
      },
    ],
  },
};
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  //   if (user?.userStatus === "PENDING") {
  //     return redirect("/pending");
  //   }

  //   if (user?.userStatus === "INACTIVE") {
  //     return redirect("/inactive");
  //   }


  return (
    <div className="flex">
      <div className="flex flex-col h-full w-full overflow-hidden">
        <Header
          id={user.id as string}
          name={user.name as string}
          email={user.email as string}
          avatar={user.image as string}
        />
        <div className="flex-1 space-y-4 p-8 pt-6 border-l min-h-screen h-full">{children}</div>
      </div>
    </div>
  );
}
