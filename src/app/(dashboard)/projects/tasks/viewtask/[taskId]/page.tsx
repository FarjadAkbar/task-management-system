import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import moment from "moment"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Shield, User } from "lucide-react"
import { getTask } from "@/actions/projects/get-task"
import { getTaskDocuments } from "@/actions/projects/get-task-documents"
import { getTaskComments } from "@/actions/projects/get-task-comments"
import { getActiveUsers } from "@/actions/get-users"
import { getBoards } from "@/actions/projects/get-boards"
import TaskViewActions from "./components/TaskViewActions"
import { TaskChecklist } from "./components/TaskChecklist"
import ModalDropzone from "@/components/modals/modal-dropzone"
import { TeamConversations } from "./components/team-conversation"

interface TaskPageProps {
  params: { taskId: string }
}

const TaskPage = async ({ params }: TaskPageProps) => {
  const session = await getServerSession(authOptions)
  const user = session?.user
  const { taskId } = params
  const task: any = await getTask(taskId)
  const taskDocuments: any = await getTaskDocuments(taskId)
  const comments: any = await getTaskComments(taskId)
  const activeUsers: any = await getActiveUsers()
  const boards = await getBoards(user?.id!);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
              <CardDescription className="text-lg">{task.content}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Due: {moment(task.dueDateAt).format("MMM D, YYYY")}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <Badge variant={task.priority === "high" ? "destructive" : "outline"}>{task.priority}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{task.assigned_user?.name || "Unassigned"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Created: {moment(task.createdAt).format("MMM D, YYYY")}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <Badge variant={task.taskStatus === "completed" ? "secondary" : "default"}>{task.taskStatus}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">
                      Created by: {activeUsers.find((user: any) => user.id === task.createdBy)?.name || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <TaskViewActions taskId={taskId} users={activeUsers} boards={boards} initialData={task} />
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskChecklist taskId={taskId} initialChecklist={task.checklist} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents ({taskDocuments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {taskDocuments.map((document: any) => (
                  <Button key={document.id} variant="outline" asChild className="w-full">
                    <Link href={document.document_file_url}>{document.document_name}</Link>
                  </Button>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <ModalDropzone taskId={taskId} />
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Team Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <TeamConversations data={comments} taskId={task.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TaskPage

