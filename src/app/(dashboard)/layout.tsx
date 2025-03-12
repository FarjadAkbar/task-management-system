import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Header } from "@/components/dashboard/header";
import { Footer } from "@/components/dashboard/footer";
import { getUser } from "@/lib/get-user";

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
  const data = await getUser();

  if (!data) {
    return <div>No user data.</div>;
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header
          id={data.id}
          name={data.name || ""}
          email={data.email}
          avatar={data.avatar || "/images/avatar.png"}
        />

        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
        <Footer />
      </div>
    </>
  );
}
