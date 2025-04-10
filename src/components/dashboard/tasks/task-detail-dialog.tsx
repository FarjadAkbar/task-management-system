"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parse } from "date-fns";
import { Calendar, Clock, BarChart, CheckCircle2 } from "lucide-react";
import { TaskChecklist } from "./task-checklist";
import { TaskComments } from "./task-comments";
import { TaskAttachments } from "./task-attachments";
import { TaskFeedback } from "./task-feedback";
import { useCompleteTask, useTask, useUpdateTask } from "@/service/tasks";
import { useGetUsersQuery } from "@/service/users";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { EditableField } from "./EditableField";

interface TaskDetailDialogProps {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailDialog({ taskId, open, onOpenChange }: TaskDetailDialogProps) {
  const { data: task, isLoading, isError } = useTask(taskId);
  const { mutate: completeTask, isPending: isCompleting } = useCompleteTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { data: usersData } = useGetUsersQuery({ search: "" });

  const [isEditingPriority, setIsEditingPriority] = useState(false);

  const handleSave = (field: string, value: string) => {
    if (!task) return;

    let updatedValue: any = value.trim();
    const originalValue = (task as any)[field] || "";

    if (field === "tags") {
      updatedValue = value.split(",").map((tag) => tag.trim()).filter(Boolean);
    } else if (field === "weight" || field === "estimatedHours") {
      updatedValue = Number(value) || 0;
    } else if (field === "startDate" || field === "dueDateAt") {
      try {
        updatedValue = parse(value, "MMM d, yyyy", new Date());
        if (isNaN(updatedValue.getTime())) {
          toast({ title: "Invalid date", description: "Use format: MMM d, yyyy" });
          return;
        }
      } catch {
        toast({ title: "Invalid date", description: "Use format: MMM d, yyyy" });
        return;
      }
    }

    if (updatedValue !== originalValue && (typeof updatedValue !== "string" || updatedValue)) {
      updateTask(
        { id: taskId, [field]: updatedValue },
        {
          onSuccess: () => toast({ title: "Task updated", description: `${field} saved.` }),
          onError: (error: Error) =>
            toast({
              title: "Update failed",
              description: `Failed to update ${field}: ${error.message}`,
              variant: "destructive",
            }),
        }
      );
    }
  };

  const handlePriorityChange = (value: string) => {
    if (task?.priority !== value) {
      updateTask(
        { id: taskId, priority: value },
        {
          onSuccess: () => toast({ title: "Task updated", description: `Priority saved.` }),
          onError: (error: Error) =>
            toast({
              title: "Update failed",
              description: `Failed to update priority: ${error.message}`,
              variant: "destructive",
            }),
        }
      );
    }
    setIsEditingPriority(false);
  };

  const handleAssigneesChange = (value: string[]) => {
    if (JSON.stringify(task?.assignees?.map((a: any) => a.userId)) !== JSON.stringify(value)) {
      updateTask(
        { id: taskId, assignees: value },
        {
          onSuccess: () => toast({ title: "Task updated", description: `Assignees saved.` }),
          onError: (error: Error) =>
            toast({
              title: "Update failed",
              description: `Failed to update assignees: ${error.message}`,
              variant: "destructive",
            }),
        }
      );
    }
  };

  const handleCompleteTask = () => {
    completeTask(taskId, {
      onSuccess: () => toast({ title: "Task completed", description: "The task has been marked as complete" }),
      onError: (error) =>
        toast({
          title: "Failed to complete task",
          description: error.message,
          variant: "destructive",
        }),
    });
  };

  const userOptions = usersData?.users.map((user) => ({
    label: user.name || user.email,
    value: user.id,
  })) || [];

  const tagOptions = [
    { label: "Bug", value: "bug" },
    { label: "Feature", value: "feature" },
    { label: "Enhancement", value: "enhancement" },
    { label: "Documentation", value: "documentation" },
    { label: "Design", value: "design" },
    { label: "Testing", value: "testing" },
  ];

  const subtaskCount = task?.subtasks?.length || 0;
  const completedSubtasks = task?.subtasks?.filter((subtask) => subtask.completed)?.length || 0;
  const subtaskProgress = subtaskCount > 0 ? (completedSubtasks / subtaskCount) * 100 : 0;

  const checklistCount = task?.checklists?.length || 0;
  const completedChecklists = task?.checklists?.filter((item) => item.completed)?.length || 0;
  const checklistProgress = checklistCount > 0 ? (completedChecklists / checklistCount) * 100 : 0;

  const isCompleted = task?.taskStatus === "COMPLETE";

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
    );
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
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              <DialogTitle className="text-xl">
                <EditableField
                  field="title"
                  value={task.title || "Untitled"}
                  onSave={handleSave}
                  displayClassName="text-xl font-semibold"
                  inputClassName="w-full p-0 border-none focus:outline-none focus:ring-0 text-xl font-semibold"
                />
              </DialogTitle>
              <Badge variant={isCompleted ? "default" : "outline"} className="ml-2">
                {isCompleted ? "Completed" : "In Progress"}
              </Badge>
            </div>
            <div className="flex gap-2">
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
          <div className="space-y-4">
            <EditableField
              field="content"
              value={task.content || "Add a description..."}
              onSave={handleSave}
              displayClassName="text-sm text-gray-700"
              inputClassName="w-full p-0 border-none focus:outline-none focus:ring-0 text-sm"
              asTextarea
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Created: </span>
                  <span className="ml-1">{format(new Date(task.createdAt), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Start Date: </span>
                  <EditableField
                    field="startDate"
                    value={task.startDate ? format(new Date(task.startDate), "MMM d, yyyy") : "Set start date"}
                    onSave={handleSave}
                    displayClassName="ml-1 text-sm"
                    inputClassName="ml-1 h-6 w-32 p-1 border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Due Date: </span>
                  <EditableField
                    field="dueDateAt"
                    value={task.dueDateAt ? format(new Date(task.dueDateAt), "MMM d, yyyy") : "Set due date"}
                    onSave={handleSave}
                    displayClassName="ml-1 text-sm"
                    inputClassName="ml-1 h-6 w-32 p-1 border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <BarChart className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Priority: </span>
                  {isEditingPriority ? (
                    <Select
                      value={task.priority || "MEDIUM"}
                      onValueChange={handlePriorityChange}
                      onOpenChange={(open) => !open && setIsEditingPriority(false)}
                    >
                      <SelectTrigger className="ml-2 h-6 w-24 text-xs">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span
                      className="ml-2 text-sm cursor-pointer hover:bg-gray-100 p-1 rounded"
                      onClick={() => setIsEditingPriority(true)}
                    >
                      {task.priority || "Set priority"}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm">
                  <BarChart className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Weight: </span>
                  <EditableField
                    field="weight"
                    value={task.weight?.toString() || "1"}
                    onSave={handleSave}
                    displayClassName="ml-2 text-sm"
                    inputClassName="ml-2 h-6 w-24 p-1 border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Estimated Hours: </span>
                  <EditableField
                    field="estimatedHours"
                    value={task.estimatedHours?.toString() || "Set hours"}
                    onSave={handleSave}
                    displayClassName="ml-2 text-sm"
                    inputClassName="ml-2 h-6 w-24 p-1 border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Tags: </span>
              <MultiSelect
                placeholder="Select tags"
                options={tagOptions}
                defaultValue={task.tags || []}
                onValueChange={(value) => handleSave("tags", value.join(", "))}
                maxCount={3}
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Assignees</h4>
              <MultiSelect
                placeholder="Select assignees"
                options={userOptions}
                defaultValue={task.assignees?.map((a: any) => a.userId) || []}
                onValueChange={handleAssigneesChange}
              />
            </div>
          </div>

          <Separator />
          <TaskAttachments taskId={task.id} attachments={task.documents} />
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
          <TaskChecklist taskId={task.id} checklist={task.checklists} />
          <TaskComments taskId={task.id} comments={task.comments} />
          <TaskFeedback taskId={task.id} feedback={task.task_feedback} />
        </div>
      </DialogContent>
    </Dialog>
  );
}