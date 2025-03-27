"use client"

import { memo, useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus } from "lucide-react"
import { TaskCard } from "./task-card"
import { CreateTaskDialog } from "./create-task-dialog"
import { useSprintTasks } from "@/service/sprints"
import { useMoveTask } from "@/service/tasks"
import { useSections } from "@/service/board"
import { TaskType } from "@/service/tasks/type"

interface TaskBoardProps {
  boardId: string
  sprintId?: string
}

const MemoizedTaskCard = memo(TaskCard)

export function TaskBoard({ boardId, sprintId }: TaskBoardProps) {
  const { data: sections, isLoading: loadingSections } = useSections(boardId)
  const { data: sprintTasks, isLoading: loadingSprintTasks } = useSprintTasks(sprintId)
  const { mutate: moveTask } = useMoveTask()

  const [createTaskSection, setCreateTaskSection] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // Add local state to manage tasks
  const [localTasks, setLocalTasks] = useState<TaskType[]>([])

   // Initialize local tasks when sprintTasks changes
   useEffect(() => {
    if (sprintTasks) {
      setLocalTasks(sprintTasks)
    }
  }, [sprintTasks])


  // Group sprint tasks by section if sprintId is provided
  const sectionTasksMap = new Map()

  if (sprintId && localTasks.length > 0) {
    // Initialize all sections with empty arrays
    sections?.forEach((section) => {
      sectionTasksMap.set(section.id, [])
    })

    // Group tasks by section
    localTasks.forEach((task) => {
      const sectionId = task.assigned_section?.id
      if (sectionId) {
        if (!sectionTasksMap.has(sectionId)) {
          sectionTasksMap.set(sectionId, [])
        }
        sectionTasksMap.get(sectionId).push(task)
      }
    })
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    // Dropped outside the list
    if (!destination) return

    // Dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    // Update local state immediately for a smooth UI experience
    setLocalTasks((prevTasks) => {
      const updatedTasks = [...prevTasks]
      const taskIndex = updatedTasks.findIndex((task) => task.id === draggableId)

      if (taskIndex !== -1) {
        // Update the task's section
        const taskToMove = { ...updatedTasks[taskIndex] }

        // Update the assigned section
        taskToMove.assigned_section = {
          ...taskToMove.assigned_section,
          id: destination.droppableId,
        }

        updatedTasks[taskIndex] = taskToMove
      }

      return updatedTasks
    })

    // Call the API to persist the change
    moveTask({
      taskId: draggableId,
      sectionId: destination.droppableId,
      position: destination.index,
    })
  }


  if (loadingSections || loadingSprintTasks) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-24 w-full mb-2" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sections?.map((section) => {
            // Get tasks for this section
            const sectionTasks: TaskType[] = sprintId ? sectionTasksMap.get(section.id) || [] : [] // We'll implement this when we add section tasks fetching

            return (
              <Droppable droppableId={section.id} key={section.id}>
                {(provided) => (
                  <Card ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm font-medium">
                          {section.name}
                          <span className="ml-2 text-xs text-muted-foreground">({sectionTasks.length})</span>
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            setCreateTaskSection(section.id)
                            setShowCreateDialog(true)
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                      <div className="space-y-2 min-h-[50px]">
                        {sectionTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div 
                              ref={provided.innerRef} 
                              {...provided.draggableProps} 
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                backgroundColor: `${section.color}`,
                                opacity: snapshot.isDragging ? 0.8 : 1,
                                transform: snapshot.isDragging ? provided.draggableProps.style?.transform : "none",
                                boxShadow: snapshot.isDragging ? "0 5px 10px rgba(0, 0, 0, 0.2)" : "none",
                              }}
                              className={`${snapshot.isDragging ? "z-50 rounded-md" : ""}`}
                            >
                              <MemoizedTaskCard task={task} />
                            </div>
                          )}
                        </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </Droppable>
            )
          })}
        </div>
      </DragDropContext>

      {showCreateDialog && (
        <CreateTaskDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          sectionId={createTaskSection}
          sprintId={sprintId}
        />
      )}
    </>
  )
}

