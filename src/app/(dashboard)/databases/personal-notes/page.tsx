import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function PersonalNotesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Personal Notes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create a new note</CardTitle>
          <CardDescription>Add a new personal note to your database.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter your note title" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" placeholder="Enter your note content" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

