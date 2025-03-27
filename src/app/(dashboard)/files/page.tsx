import { FileExplorer } from "@/components/dashboard/filesystem/file-explorer"
import { getUser } from "@/lib/get-user"
import { syncGoogleDrive } from "@/lib/google-drive";

export default async function FilesPage() {
  const user = await getUser()
  const driv = await syncGoogleDrive();
  const isAdmin = user?.role === "ADMIN"
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Files</h1>
        <p className="text-muted-foreground">
          {isAdmin ? "Manage and share files with your team" : "Access files shared with you"}
        </p>
      </div>

      <FileExplorer isAdmin={isAdmin} />
    </div>
  )
}

