import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import moment from "moment";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Shield, Star, User } from "lucide-react";
import { getTask } from "@/actions/projects/get-task";
import { getTaskDocuments } from "@/actions/projects/get-task-documents";
import { getTaskComments } from "@/actions/projects/get-task-comments";
import { getActiveUsers } from "@/actions/get-users";
import { getBoards } from "@/actions/projects/get-boards";
import TaskViewActions from "./components/TaskViewActions";
import { TaskChecklist } from "./components/TaskChecklist";
import ModalDropzone from "@/components/modals/modal-dropzone";
import { TeamConversations } from "./components/team-conversation";
import DocumentsPerview from "./components/documents-perview";
import { getTaskFeedback } from "@/actions/projects/get-task-feedback";

interface TaskPageProps {
  params: Promise<{ taskId: string }>;
}

const TaskPage = async ({ params }: TaskPageProps) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const { taskId } = await params;
  const task: any = await getTask(taskId);
  const taskDocuments: any = await getTaskDocuments(taskId);
  const comments: any = await getTaskComments(taskId);
  const feedback: any = await getTaskFeedback(taskId);
  const activeUsers: any = await getActiveUsers();
  const boards = await getBoards(user?.id!);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
              <CardDescription className="text-lg">
                {task.content}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Due: {moment(task.dueDateAt).format("MMM D, YYYY")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <Badge
                      variant={
                        task.priority === "high" ? "destructive" : "outline"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">
                      {task.assigned_user?.name || "Unassigned"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">
                      Created: {moment(task.createdAt).format("MMM D, YYYY")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <Badge
                      variant={
                        task.taskStatus === "completed"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {task.taskStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">
                      Created by:{" "}
                      {activeUsers.find(
                        (user: any) => user.id === task.createdBy
                      )?.name || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <TaskViewActions
                taskId={taskId}
                users={activeUsers}
                boards={boards}
                initialData={task}
                isAdmin={user?.isAdmin || false}
                feedback={feedback.length > 0 ? false : true}
              />
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskChecklist
                taskId={taskId}
                initialChecklist={task.checklist}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents ({taskDocuments.length})</CardTitle>
            </CardHeader>
            <CardContent>
            {taskDocuments.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-2">Uploaded files:</p>
                  <DocumentsPerview taskDocuments={taskDocuments} />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <ModalDropzone taskId={taskId} />
            </CardFooter>
          </Card>

          {feedback.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedback.map((item: any) => (
                    <div key={item.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.user.name}</span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= item.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{item.feedback}</p>
                      <span className="text-xs text-gray-400 mt-1">{moment(item.createdAt).format("MMM D, YYYY")}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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
  );
};

export default TaskPage;
