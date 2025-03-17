"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, KanbanSquare, Table2 } from "lucide-react"
import { useProject } from "@/service/projects"
import { TaskBoard } from "@/components/dashboard/tasks/task-board"
import { useBoards } from "@/service/board"
import { useState } from "react"
import { CreateTaskDialog } from "../tasks/create-task-dialog"
import { CreateBoardDialog } from "./create-board-dialog"

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{project?.name} Board</h1>
          <p className="text-muted-foreground">
            {activeSprint ? `Current Sprint: ${activeSprint.name}` : "No active sprint"}
          </p>
        </div>

        <Button onClick={handleAddTask}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
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
            <TaskBoard boardId={firstBoard.id} sprintId={activeSprint?.id} />
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

