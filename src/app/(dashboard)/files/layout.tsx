import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Files",
  description: "Manage your files and shared documents",
}

export default function FilesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Files</h1>
        <p className="text-muted-foreground">Manage your files and shared documents</p>
      </div>

      <Tabs defaultValue="private" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="private" asChild>
            <a href="/files">My Files</a>
          </TabsTrigger>
          <TabsTrigger value="shared" asChild>
            <a href="/files/shared">Shared Files</a>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="private" className="mt-6">
          {children}
        </TabsContent>

        <TabsContent value="shared" className="mt-6">
          {children}
        </TabsContent>
      </Tabs>
    </div>
  )
}

