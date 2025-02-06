import { getUsers } from "../actions/get-users"
import { requireUser } from "@/lib/user"
import { CreateNewEventForm } from "../_components/CreateNewEventForm"

export default async function CreateNewEventPage() {
  const user = await requireUser()
  const employees = await getUsers(user.id)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add new appointment type</h1>
        <p className="text-muted-foreground mb-8">Create a new appointment type that allows people to book times.</p>
        <CreateNewEventForm employees={employees} />
      </div>
    </div>
  )
}

