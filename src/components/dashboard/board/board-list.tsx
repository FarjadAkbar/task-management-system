"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, KanbanSquare, Table2, Home, ArrowLeft, ChevronRight } from "lucide-react"
import { useProject } from "@/service/projects"
import { TaskBoard } from "@/components/dashboard/tasks/task-board"
import { useBoards } from "@/service/board"
import { useState } from "react"
import { CreateTaskDialog } from "../tasks/create-task-dialog"
import { CreateBoardDialog } from "./create-board-dialog"
import { TaskTableView } from "../tasks/task-table-view"
import AdminWrapper from "../admin-wrapper"
import Link from "next/link"

export default function ProjectBoard({ projectId }: { projectId: string }) {
  const { data: project, isLoading: loadingProject } = useProject(projectId)
  const { data: boards, isLoading: loadingBoards } = useBoards(projectId)

  // State for dialogs
  const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false)
  const [showCreateBoardDialog, setShowCreateBoardDialog] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)

  // Get the active sprint if any
  const activeSprint = project?.sprints?.find((sprint) => sprint.status === "ACTIVE")

  if (loadingProject || loadingBoards) {
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

  // Get the first board or null if no boards
  const firstBoard = boards && boards.length > 0 ? boards[0] : null

  // Get the first section of the first board if available
  const firstSection = firstBoard?.sections && firstBoard.sections.length > 0 ? firstBoard.sections[0] : null

  const handleAddTask = () => {
    if (firstSection) {
      setSelectedSectionId(firstSection.id)
      setShowCreateTaskDialog(true)
    } else {
      // If no section exists, prompt to create a board first
      setShowCreateBoardDialog(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground flex items-center">
          <Home className="h-4 w-4 mr-1" />
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/projects" className="hover:text-foreground">
          Projects
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/projects/${projectId}`} className="hover:text-foreground">
          {project?.name || "Project"}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Board</span>
      </nav>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-1" />
              Dashboard
            </Link>
          </Button>
          
          <Button variant="outline" size="sm" asChild>
            <Link href={`/projects/${projectId}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Project
            </Link>
          </Button>

          {activeSprint && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/projects/${projectId}/sprints/${activeSprint.id}`}>
                <KanbanSquare className="h-4 w-4 mr-1" />
                Sprint
              </Link>
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{project?.name} Board</h1>
            <p className="text-muted-foreground">
              {activeSprint ? `Current Sprint: ${activeSprint.name}` : "No active sprint"}
            </p>
          </div>

          <AdminWrapper>
            <Button onClick={handleAddTask} className="bg-black text-gold hover:text-black hover:bg-gold">
              <Plus className="mr-1 h-4 w-4" />
              Add Task
            </Button>
          </AdminWrapper>
        </div>
      </div>

      {!firstBoard ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <KanbanSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No boards found</h3>
              <p className="text-muted-foreground mb-4">Create a board to start organizing your tasks</p>
              <Button onClick={() => setShowCreateBoardDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Board
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="kanban">
          <TabsList className="bg-black">
            <TabsTrigger value="kanban" className="text-gold">
              <KanbanSquare className="h-4 w-4 mr-2" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="table" className="text-gold">
              <Table2 className="h-4 w-4 mr-2" />
              Table
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-6">
            <TaskBoard boardId={firstBoard.id} sprintId={activeSprint?.id} />
          </TabsContent>

          <TabsContent value="table" className="mt-6">
            <TaskTableView boardId={firstBoard.id} sprintId={activeSprint?.id} />
          </TabsContent>
        </Tabs>
      )}

      {/* Create Task Dialog */}
      {showCreateTaskDialog && (
        <CreateTaskDialog
          open={showCreateTaskDialog}
          onOpenChange={setShowCreateTaskDialog}
          sectionId={selectedSectionId}
          sprintId={activeSprint?.id}
        />
      )}

      {/* Create Board Dialog */}
      <CreateBoardDialog projectId={projectId} open={showCreateBoardDialog} onOpenChange={setShowCreateBoardDialog} />
    </div>
  )
}

