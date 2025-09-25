"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, CheckCircle2, AlertTriangle, Target } from "lucide-react"
import { format } from "date-fns"
import { SprintType } from "@/service/sprints/type"
import { TaskType } from "@/service/tasks/type"

interface SprintMetricsProps {
  sprint: SprintType
  tasks: TaskType[]
}

export function SprintMetrics({ sprint, tasks }: SprintMetricsProps) {
  // Calculate metrics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.taskStatus === "COMPLETE").length
  const inProgressTasks = tasks.filter(task => task.taskStatus === "IN_PROGRESS").length
  const todoTasks = tasks.filter(task => task.taskStatus === "TODO" || task.taskStatus === "PENDING").length
  
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  // Calculate total estimated hours
  const totalEstimatedHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0)
  const completedHours = tasks
    .filter(task => task.taskStatus === "COMPLETE")
    .reduce((sum, task) => sum + (task.estimatedHours || 0), 0)
  
  // Calculate sprint progress based on time
  const now = new Date()
  const startDate = new Date(sprint.startDate)
  const endDate = new Date(sprint.endDate)
  const totalDuration = endDate.getTime() - startDate.getTime()
  const elapsed = now.getTime() - startDate.getTime()
  const timeProgress = totalDuration > 0 ? Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100) : 0
  
  // Calculate days remaining
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  
  // Get unique assignees
  const assignees = new Set(tasks.flatMap(task => task.assignees.map(a => a.user?.name || a.user?.email)).filter(Boolean))
  
  const isOverdue = now > endDate && sprint.status === "ACTIVE"
  const isNearDeadline = daysRemaining <= 3 && sprint.status === "ACTIVE"

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Sprint Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Target className="mr-2 h-4 w-4" />
            Sprint Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tasks</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{completedTasks} completed</span>
              <span>{totalTasks} total</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Time Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Duration</span>
              <span>{Math.round(timeProgress)}%</span>
            </div>
            <Progress value={timeProgress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{daysRemaining} days left</span>
              <span>
                {format(startDate, "MMM d")} - {format(endDate, "MMM d")}
              </span>
            </div>
            {(isOverdue || isNearDeadline) && (
              <Badge variant={isOverdue ? "destructive" : "secondary"} className="text-xs">
                {isOverdue ? "Overdue" : "Deadline approaching"}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Task Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Task Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Completed</span>
              <span>{completedTasks}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-600">In Progress</span>
              <span>{inProgressTasks}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">To Do</span>
              <span>{todoTasks}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Total</span>
              <span>{totalTasks}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team & Hours */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Team & Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Team Members</span>
              <span>{assignees.size}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Est. Hours</span>
              <span>{totalEstimatedHours}h</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Completed</span>
              <span>{completedHours}h</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Remaining</span>
              <span>{totalEstimatedHours - completedHours}h</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
