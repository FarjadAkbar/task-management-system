"use client"

import { memo, useEffect, useState } from "react"
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  type DragOverEvent,
  useDroppable,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus } from "lucide-react"
import { TaskCard } from "./task-card"
import { CreateTaskDialog } from "./create-task-dialog"
import { useSprintTasks } from "@/service/sprints"
import { useMoveTask } from "@/service/tasks"
import { useSections } from "@/service/board"
import type { TaskType } from "@/service/tasks/type"
import AdminWrapper from "../admin-wrapper"

interface TaskBoardProps {
  boardId: string
  sprintId: string
}

// Create a sortable wrapper for TaskCard

// Create a droppable section component
const DroppableSection = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `section:${id}`,
  })

  return (
    <div ref={setNodeRef} className={`h-full ${isOver ? "ring-2 ring-primary ring-opacity-50" : ""}`}>
      {children}
    </div>
  )
}

// Create a sortable wrapper for TaskCard
const SortableTaskCard = memo(({ task, id, bgColor }: { task: TaskType; id: string; bgColor: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `task:${id}`,
    data: {
      type: "task",
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: bgColor,
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-manipulation">
      <TaskCard task={task} taskId={task.id} />
    </div>
  )
})

SortableTaskCard.displayName = "SortableTaskCard"

const MemoizedTaskCard = memo(TaskCard)

// Helper function to find the container (section) a task belongs to
function findContainer(containersMap: Map<string, TaskType[]>, id: string) {
  // Remove the 'task:' prefix if it exists
  const taskId = id.startsWith("task:") ? id.substring(5) : id

  for (const [containerId, items] of containersMap.entries()) {
    if (items.some((item) => item.id === taskId)) {
      return containerId
    }
  }
  return null
}

export function TaskBoard({ boardId, sprintId }: TaskBoardProps) {
  const { data: sections, isLoading: loadingSections } = useSections(boardId)
  const { data: sprintTasks, isLoading: loadingSprintTasks } = useSprintTasks(sprintId)
  const { mutate: moveTask } = useMoveTask()

  const [createTaskSection, setCreateTaskSection] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeTask, setActiveTask] = useState<TaskType | null>(null)
  const [items, setItems] = useState<Record<string, string[]>>({})

  const sectionColors: Record<string, { bg: string; header: string }> = {
    "To Do": { bg: "#D3D5D6FF", header: "#1E293B" },
    "In Progress": { bg: "#C9E5F8FF", header: "#0284C7" },
    "Approval": { bg: "#f8c9c9", header: "#d02c06" },
    Done: { bg: "#BCF5D0FF ", header: "#059669" },
  }

  // Add local state to manage tasks
  const [localTasks, setLocalTasks] = useState<TaskType[]>([])

  // Initialize local tasks when sprintTasks changes
  useEffect(() => {
    if (sprintTasks) {
      setLocalTasks(sprintTasks)
    }
  }, [sprintTasks])

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

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

  // Prepare items for SortableContext
  useEffect(() => {
    const newItems: Record<string, string[]> = {}

    for (const [sectionId, tasks] of sectionTasksMap.entries()) {
      newItems[sectionId] = tasks.map((task: TaskType) => `task:${task.id}`)
    }

    setItems(newItems)
  }, [localTasks])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const id = active.id as string

    setActiveId(id)

    // Extract the task ID from the prefixed format
    const taskId = id.startsWith("task:") ? id.substring(5) : id
    const task = localTasks.find((t) => t.id === taskId)

    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    console.log("Drag over - Active ID:", activeId, "Over ID:", overId)

    // Extract the task ID from the prefixed format
    const taskId = activeId.startsWith("task:") ? activeId.substring(5) : activeId

    // Find the containers
    const activeContainer = findContainer(sectionTasksMap, taskId)

    // If over a task, find its container
    let overContainer: string | null = null

    if (overId.startsWith("section:")) {
      // Directly over a section
      overContainer = overId.substring(8)
    } else if (overId.startsWith("task:")) {
      // Over another task, find its container
      overContainer = findContainer(sectionTasksMap, overId.substring(5))
    }

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return
    }

    setItems((prev) => {
      const activeItems = [...prev[activeContainer]]
      const overItems = [...prev[overContainer!]]

      const activeIndex = activeItems.indexOf(`task:${taskId}`)

      // Remove from original container
      activeItems.splice(activeIndex, 1)

      // Add to new container at the end
      overItems.push(`task:${taskId}`)

      return {
        ...prev,
        [activeContainer]: activeItems,
        [overContainer!]: overItems,
      }
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      setActiveTask(null)
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    console.log("Drag end - Active ID:", activeId, "Over ID:", overId)

    // Extract the task ID from the prefixed format
    const taskId = activeId.startsWith("task:") ? activeId.substring(5) : activeId

    // Find the containers
    const activeContainer = findContainer(sectionTasksMap, taskId)

    // If over a task, find its container
    let overContainer: string | null = null
    let overIndex = -1

    if (overId.startsWith("section:")) {
      // Directly over a section
      overContainer = overId.substring(8)
    } else if (overId.startsWith("task:")) {
      // Over another task, find its container
      const overTaskId = overId.substring(5)
      overContainer = findContainer(sectionTasksMap, overTaskId)

      if (overContainer) {
        // Find the index of the task we're over
        const overItems = sectionTasksMap.get(overContainer)
        overIndex = overItems.findIndex((item: TaskType) => item.id === overTaskId)
      }
    }

    if (!activeContainer) {
      setActiveId(null)
      setActiveTask(null)
      return
    }

    // Handle sorting within the same container
    if (activeContainer === overContainer) {
      const activeIndex = sectionTasksMap.get(activeContainer).findIndex((item: TaskType) => item.id === taskId)

      if (activeIndex !== overIndex && overIndex !== -1) {
        // Update local state for immediate UI update
        setLocalTasks((prevTasks) => {
          const updatedTasks = [...prevTasks]
          const sectionTasks = [...sectionTasksMap.get(activeContainer)]
          const reorderedSectionTasks = arrayMove(sectionTasks, activeIndex, overIndex)

          // Update the tasks in the section with their new order
          reorderedSectionTasks.forEach((task, index) => {
            const taskIndex = updatedTasks.findIndex((t) => t.id === task.id)
            if (taskIndex !== -1) {
              updatedTasks[taskIndex] = {
                ...updatedTasks[taskIndex],
              }
            }
          })

          return updatedTasks
        })

        // Call API to update position
        moveTask({
          taskId,
          sectionId: activeContainer,
          position: overIndex,
        })
      }
    } else if (overContainer) {
      // Moving to a different container
      // Update local state for immediate UI update
      setLocalTasks((prevTasks) => {
        const updatedTasks = [...prevTasks]
        const taskIndex = updatedTasks.findIndex((t) => t.id === taskId)

        if (taskIndex !== -1) {
          // Update the task's section
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            assigned_section: {
              ...updatedTasks[taskIndex].assigned_section,
              id: overContainer,
            },
          }
        }

        return updatedTasks
      })

      // Calculate position - if over a task, use its position, otherwise add to the end
      const position = overIndex !== -1 ? overIndex : sectionTasksMap.get(overContainer)?.length || 0

      // Call API to update section and position
      moveTask({
        taskId,
        sectionId: overContainer,
        position,
      })
    }

    setActiveId(null)
    setActiveTask(null)
  }

  if (loadingSections || loadingSprintTasks) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {sections?.map((section) => {
            // Get tasks for this section
            const sectionTasks: TaskType[] = sprintId ? sectionTasksMap.get(section.id) || [] : []
            const sectionColor = sectionColors[section.name] || { bg: "#FFFFFF", header: "#F1F5F9" }
            const taskIds = items[section.id] || sectionTasks.map((task) => `task:${task.id}`)

            return (
              <DroppableSection id={section.id} key={section.id}>
                <Card
                  className="flex flex-col h-full rounded-xl shadow-md overflow-hidden border"
                  style={{
                    backgroundColor: sectionColor.bg,
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  {/* Header */}
                  <CardHeader
                    className="p-4 text-white font-semibold text-center uppercase tracking-wide"
                    style={{
                      background: sectionColor.header,
                      borderRadius: "10px 10px 0 0",
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">
                        {section.name}
                        <span className="ml-2 text-xs text-muted-foreground">({sectionTasks.length})</span>
                      </CardTitle>
                      <AdminWrapper>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-white hover:text-black transition"
                          onClick={() => {
                            setCreateTaskSection(section.id)
                            setShowCreateDialog(true)
                          }}
                        >
                          <Plus className="h-6 w-6" />
                        </Button>
                      </AdminWrapper>
                    </div>
                  </CardHeader>

                  {/* Task List */}
                  <CardContent className="flex-1 overflow-y-auto p-4">
                    <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3 min-h-[150px]">
                        {sectionTasks.map((task) => (
                          <SortableTaskCard key={task.id} task={task} id={task.id} bgColor={`${section.color}`} />
                        ))}
                        {sectionTasks.length === 0 && (
                          <div className="h-20 flex items-center justify-center text-sm text-muted-foreground border border-dashed rounded-md">
                            Drop tasks here
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </CardContent>
                </Card>
              </DroppableSection>
            )
          })}
        </div>

        <DragOverlay>
          {activeId && activeTask ? (
            <div className="opacity-80 shadow-md rounded-md">
              <MemoizedTaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

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


