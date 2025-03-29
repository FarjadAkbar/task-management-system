"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { Calendar, Clock, BarChart, CheckCircle2, Edit } from "lucide-react"
import { TaskSubtasks } from "./task-subtasks"
import { TaskChecklist } from "./task-checklist"
import { TaskComments } from "./task-comments"
import { TaskAttachments } from "./task-attachments"
import { TaskFeedback } from "./task-feedback"
import { EditTaskDialog } from "./edit-task-dialog"
import { useCompleteTask, useDeleteTask, useTask } from "@/service/tasks"
import { toast } from "@/hooks/use-toast"
import DeleteConfirmationDialog from "@/components/modals/delete-confitmation"

interface TaskDetailDialogProps {
  taskId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailDialog({ taskId, open, onOpenChange }: TaskDetailDialogProps) {
  const { data: task, isLoading, isError } = useTask(taskId)
  const { mutate: completeTask, isPending: isCompleting } = useCompleteTask()
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask()

  const [showEditDialog, setShowEditDialog] = useState(false)

  const handleCompleteTask = () => {
    completeTask(taskId, {
      onSuccess: () => {
        toast({
          title: "Task completed",
          description: "The task has been marked as complete",
        })
      },
      onError: (error) => {
        toast({
          title: "Failed to complete task",
          description: error.message,
          variant: "destructive",
        })
      },
    })
  }

  const onDeleteTask = () => {
    deleteTask(taskId, {
      onSuccess: () => {
        toast({
          title: "Task deleted",
          description: "The task has been deleted",
        })
        onOpenChange(false)
      },
      onError: (error) => {
        toast({
          title: "Failed to delete task",
          description: error.message,
          variant: "destructive",
        })
      },
    })
  }

  // Calculate completion stats
  const subtaskCount = task?.subtasks?.length || 0
  const completedSubtasks = task?.subtasks?.filter((subtask) => subtask.completed)?.length || 0
  const subtaskProgress = subtaskCount > 0 ? (completedSubtasks / subtaskCount) * 100 : 0

  const checklistCount = task?.checklists?.length || 0
  const completedChecklists = task?.checklists?.filter((item) => item.completed)?.length || 0
  const checklistProgress = checklistCount > 0 ? (completedChecklists / checklistCount) * 100 : 0

  const isCompleted = task?.taskStatus === "COMPLETE"
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <Skeleton className="h-6 w-3/4" />
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (isError || !task) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-destructive">Failed to load task details</p>
            <Button variant="outline" className="mt-4" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-2">
                <DialogTitle className="text-xl">{task.title}</DialogTitle>
                <Badge variant={isCompleted ? "default" : "outline"} className="ml-2">
                  {isCompleted ? "Completed" : "In Progress"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)} disabled={isDeleting}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <DeleteConfirmationDialog name={task.title} onDelete={onDeleteTask} disabled={isDeleting} />

                {!isCompleted && (
                  <Button size="sm" onClick={handleCompleteTask} disabled={isCompleting}>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    {isCompleting ? "Completing..." : "Complete"}
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Task details */}
            <div className="space-y-4">
              {task.content && <div className="text-sm">{task.content}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Created: </span>
                    <span className="ml-1">{format(new Date(task.createdAt), "MMM d, yyyy")}</span>
                  </div>

                  {task.startDate && (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Start Date: </span>
                      <span className="ml-1">{format(new Date(task.startDate), "MMM d, yyyy")}</span>
                    </div>
                  )}

                  {task.dueDateAt && (
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Due Date: </span>
                      <span className="ml-1">{format(new Date(task.dueDateAt), "MMM d, yyyy")}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <BarChart className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Priority: </span>
                    <Badge variant="outline" className="ml-1">
                      {task.priority}
                    </Badge>
                  </div>

                  <div className="flex items-center text-sm">
                    <BarChart className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Weight: </span>
                    <span className="ml-1">{task.weight}</span>
                  </div>

                  {task.estimatedHours && (
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Estimated Hours: </span>
                      <span className="ml-1">{task.estimatedHours}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Assignees */}
              {task.assignees && task.assignees.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Assignees</h4>
                  <div className="flex flex-wrap gap-2">
                    {task.assignees.map((assignee: any) => (
                      <div key={assignee.id} className="flex items-center gap-2 bg-muted/50 rounded-full px-2 py-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={assignee.user?.avatar} />
                          <AvatarFallback>
                            {assignee.user?.name?.charAt(0) || assignee.user?.email?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{assignee.user?.name || assignee.user?.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress */}
              <div className="space-y-4">
                {subtaskCount > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtasks</span>
                      <span>
                        {completedSubtasks}/{subtaskCount}
                      </span>
                    </div>
                    <Progress value={subtaskProgress} className="h-2" />
                  </div>
                )}

                {checklistCount > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Checklist</span>
                      <span>
                        {completedChecklists}/{checklistCount}
                      </span>
                    </div>
                    <Progress value={checklistProgress} className="h-2" />
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Tabs for subtasks, checklist, comments, etc. */}
            <Tabs defaultValue="checklist">
              <TabsList className="grid grid-cols-4">
                {/* <TabsTrigger value="subtasks">Subtasks</TabsTrigger> */}
                <TabsTrigger value="checklist">Checklist</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>

              {/* <TabsContent value="subtasks" className="space-y-4 mt-4">
                <TaskSubtasks taskId={task.id} subtasks={task.subtasks} />
              </TabsContent> */}

              <TabsContent value="checklist" className="space-y-4 mt-4">
                <TaskChecklist taskId={task.id} checklist={task.checklists} />
              </TabsContent>

              <TabsContent value="comments" className="space-y-4 mt-4">
                <TaskComments taskId={task.id} comments={task.comments} />
              </TabsContent>

              <TabsContent value="attachments" className="space-y-4 mt-4">
                <TaskAttachments taskId={task.id} attachments={task.documents} />
              </TabsContent>

              <TabsContent value="feedback" className="space-y-4 mt-4">
                <TaskFeedback taskId={task.id} feedback={task.task_feedback} />
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {showEditDialog && <EditTaskDialog taskId={task.id} open={showEditDialog} onOpenChange={setShowEditDialog} />}
    </>
  )
}

