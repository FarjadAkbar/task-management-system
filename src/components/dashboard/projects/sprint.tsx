"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, CheckCircle2, KanbanSquare, Table2, Play, CheckSquare, AlertTriangle, Plus, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useCompleteSprint, useSprint, useSprintTasks, useStartSprint } from "@/service/sprints"
import { TaskBoard } from "@/components/dashboard/tasks/task-board"
import { CreateTaskDialog } from "@/components/dashboard/tasks/create-task-dialog"
import { SprintMetrics } from "./sprint-metrics"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"

export default function SprintDetail({ projectId, sprintId }: { projectId: string; sprintId: string }) {
  const router = useRouter()
  const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false)

  const { data: sprint, isLoading: loadingSprint } = useSprint(sprintId)
  const { data: tasks, isLoading: loadingTasks } = useSprintTasks(sprintId)

  const { mutate: startSprint, isPending: isStarting } = useStartSprint()
  const { mutate: completeSprint, isPending: isCompleting } = useCompleteSprint()

  const handleStartSprint = () => {
    startSprint(sprintId, {
      onSuccess: () => {
        toast({
          title: "Sprint started",
          description: "The sprint has been started successfully",
        })
      },
      onError: (error) => {
        toast({
          title: "Failed to start sprint",
          description: error.message,
          variant: "destructive",
        })
      },
    })
  }

  const handleCompleteSprint = () => {
    completeSprint(sprintId, {
      onSuccess: () => {
        toast({
          title: "Sprint completed",
          description: "The sprint has been completed successfully",
        })
      },
      onError: (error) => {
        toast({
          title: "Failed to complete sprint",
          description: error.message,
          variant: "destructive",
        })
      },
    })
  }

  if (loadingSprint) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (!sprint) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-destructive">Sprint not found</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push(`/projects/${projectId}`)}>
              Back to Project
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate sprint stats
  const totalTasks = tasks?.length || 0
  const completedTasks = tasks?.filter((task) => task.taskStatus === "COMPLETE").length || 0
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const isActive = sprint.status === "ACTIVE"
  const isCompleted = sprint.status === "COMPLETED"
  const isPlanning = sprint.status === "PLANNING"

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/projects" className="hover:text-foreground">
          Projects
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/projects/${projectId}`} className="hover:text-foreground">
          {sprint.project?.name || "Project"}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{sprint.name}</span>
      </nav>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{sprint.name}</h1>
          <p className="text-muted-foreground">{sprint.goal || "No goal set"}</p>
        </div>

        <div className="flex gap-2">
          {isPlanning && (
            <Button onClick={handleStartSprint} disabled={isStarting}>
              <Play className="mr-2 h-4 w-4" />
              {isStarting ? "Starting..." : "Start Sprint"}
            </Button>
          )}

          {isActive && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Complete Sprint
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Complete Sprint</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to complete this sprint? This action cannot be undone.
                    {completedTasks < totalTasks && (
                      <div className="mt-2 flex items-center text-amber-500">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        <span>There are {totalTasks - completedTasks} incomplete tasks in this sprint.</span>
                      </div>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCompleteSprint} disabled={isCompleting}>
                    {isCompleting ? "Completing..." : "Complete Sprint"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button onClick={() => setShowCreateTaskDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>

          <Button variant="outline" asChild>
            <Link href={`/projects/${projectId}`}>Back to Project</Link>
          </Button>
        </div>
      </div>

      {/* Sprint Metrics */}
      <SprintMetrics sprint={sprint} tasks={tasks || []} />

      {/* Sprint info card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle>Sprint Details</CardTitle>
            <Badge variant={isActive ? "default" : isCompleted ? "success" : "secondary"}>{sprint.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Start Date: </span>
                <span className="ml-1">{format(new Date(sprint.startDate), "MMM d, yyyy")}</span>
              </div>

              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">End Date: </span>
                <span className="ml-1">{format(new Date(sprint.endDate), "MMM d, yyyy")}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created by: </span>
                <span className="ml-1">{sprint.createdBy?.name || "Unknown"}</span>
              </div>

              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created: </span>
                <span className="ml-1">{format(new Date(sprint.createdAt), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks */}
      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">
            <KanbanSquare className="h-4 w-4 mr-2" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="table">
            <Table2 className="h-4 w-4 mr-2" />
            Table
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-6">
          {loadingTasks ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[400px] w-full" />
              ))}
            </div>
          ) : (
            <TaskBoard 
              boardId={sprint.project?.boards?.[0]?.id || ''} 
              sprintId={sprintId} 
            />
          )}
        </TabsContent>

        <TabsContent value="table" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Table View</CardTitle>
              <CardDescription>View tasks in a table format</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-muted-foreground">Table view coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={showCreateTaskDialog}
        onOpenChange={setShowCreateTaskDialog}
        sectionId={null}
        sprintId={sprintId}
      />
    </div>
  )
}
