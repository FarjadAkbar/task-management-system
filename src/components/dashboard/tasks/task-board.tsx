"use client";

import type React from "react";

import { memo, useEffect, useState, useCallback, useMemo } from "react";
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
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, KanbanSquare } from "lucide-react";
import { TaskCard } from "./task-card";
import { CreateTaskDialog } from "./create-task-dialog";
import { useSprintTasks } from "@/service/sprints";
import { useMoveTask } from "@/service/tasks";
import { useSections } from "@/service/board";
import { useProject } from "@/service/projects";
import type { TaskType } from "@/service/tasks/type";
import AdminWrapper from "../admin-wrapper";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface TaskBoardProps {
  boardId: string;
  sprintId?: string;
}

// Create a droppable section component
const DroppableSection = memo(
  ({ id, children }: { id: string; children: React.ReactNode }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: `section:${id}`,
    });

    return (
      <div
        ref={setNodeRef}
        className={`h-full ${isOver ? "ring-2 ring-primary ring-opacity-50" : ""}`}
      >
        {children}
      </div>
    );
  }
);

DroppableSection.displayName = "DroppableSection";

// Create a sortable wrapper for TaskCard
const SortableTaskCard = memo(
  ({ task, id, bgColor }: { task: TaskType; id: string; bgColor: string }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: `task:${id}`,
      data: {
        type: "task",
        task,
      },
    });

    const style = useMemo(
      () => ({
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: bgColor,
        opacity: isDragging ? 0.9 : 1,
        zIndex: isDragging ? 1 : 0,
      }),
      [transform, transition, bgColor, isDragging]
    );

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="touch-manipulation"
      >
        <TaskCard task={task} taskId={task.id} />
      </div>
    );
  }
);

SortableTaskCard.displayName = "SortableTaskCard";

const MemoizedTaskCard = memo(TaskCard);

// Helper function to find the container (section) a task belongs to
const findContainer = (containersMap: Map<string, TaskType[]>, id: string) => {
  // Remove the 'task:' prefix if it exists
  const taskId = id.startsWith("task:") ? id.substring(5) : id;

  for (const [containerId, items] of containersMap.entries()) {
    if (items.some((item) => item.id === taskId)) {
      return containerId;
    }
  }
  return null;
};

export function TaskBoard({ boardId, sprintId }: TaskBoardProps) {
  const { data: sections, isLoading: loadingSections } = useSections(boardId);
  const { data: sprintTasks, isLoading: loadingSprintTasks } =
    useSprintTasks(sprintId);
  const { mutate: moveTask } = useMoveTask();

  // Get project ID from sections (assuming sections belong to a project)
  const projectId = sections?.[0]?.board?.projectId;

  // Fetch all project tasks when there's no sprint
  const { data: projectTasks, isLoading: loadingProjectTasks } = useQuery({
    queryKey: ["project-tasks", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const response = await axios.get(`/api/tasks/search?projectId=${projectId}`);
      return response.data.tasks || [];
    },
    enabled: !sprintId && !!projectId,
  });

  // If no boardId is provided, we need to fetch the project's first board
  const { data: projectBoards } = useQuery({
    queryKey: ["project-boards", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const response = await axios.get(`/api/projects/${projectId}/boards`);
      return response.data.boards || [];
    },
    enabled: !boardId && !!projectId,
  });

  // Use the first board if no boardId is provided
  const effectiveBoardId = boardId || projectBoards?.[0]?.id;
  const { data: fallbackSections, isLoading: loadingFallbackSections } = useSections(effectiveBoardId);
  
  // Use fallback sections if no sections from the original boardId
  const effectiveSections = sections || fallbackSections;
  const effectiveLoadingSections = loadingSections || loadingFallbackSections;

  const [createTaskSection, setCreateTaskSection] = useState<string | null>(
    null
  );
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [items, setItems] = useState<Record<string, string[]>>({});

  // Memoize section colors to prevent recreation on each render
  const sectionColors = useMemo(
    () => ({
      "To Do": { bg: "#D3D5D6FF", header: "#1E293B" },
      "In Progress": { bg: "#C9E5F8FF", header: "#0284C7" },
      Approval: { bg: "#f8c9c9", header: "#d02c06" },
      Done: { bg: "#BCF5D0FF ", header: "#059669" },
    }),
    []
  );

  // Add local state to manage tasks
  const [localTasks, setLocalTasks] = useState<TaskType[]>([]);

  // Initialize local tasks when sprintTasks or projectTasks change
  useEffect(() => {
    if (sprintId && sprintTasks) {
      setLocalTasks(sprintTasks);
    } else if (!sprintId && projectTasks) {
      setLocalTasks(projectTasks);
    }
  }, [sprintTasks, projectTasks, sprintId]);

  // Set up sensors for drag and drop - memoize to prevent recreation
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Memoize the section tasks map
  const sectionTasksMap = useMemo(() => {
    const map = new Map();

    if (localTasks.length > 0 && effectiveSections) {
      // Initialize all sections with empty arrays
      effectiveSections.forEach((section) => {
        map.set(section.id, []);
      });

      // Group tasks by section
      localTasks.forEach((task) => {
        const sectionId = task.assigned_section?.id;
        if (sectionId && map.has(sectionId)) {
          map.get(sectionId).push(task);
        } else if (!sectionId && effectiveSections.length > 0) {
          // If task has no section, assign it to the first section (To Do)
          const firstSection = effectiveSections[0];
          if (firstSection) {
            map.get(firstSection.id).push(task);
          }
        }
      });
    }

    return map;
  }, [localTasks, effectiveSections]);

  // Prepare items for SortableContext
  useEffect(() => {
    const newItems: Record<string, string[]> = {};

    for (const [sectionId, tasks] of sectionTasksMap.entries()) {
      newItems[sectionId] = tasks.map((task: TaskType) => `task:${task.id}`);
    }

    setItems(newItems);
  }, [sectionTasksMap]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const id = active.id as string;

      setActiveId(id);

      // Extract the task ID from the prefixed format
      const taskId = id.startsWith("task:") ? id.substring(5) : id;
      const task = localTasks.find((t) => t.id === taskId);

      if (task) {
        setActiveTask(task);
      }
    },
    [localTasks]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      console.log("Drag over - Active ID:", activeId, "Over ID:", overId);

      // Extract the task ID from the prefixed format
      const taskId = activeId.startsWith("task:")
        ? activeId.substring(5)
        : activeId;

      // Find the containers
      const activeContainer = findContainer(sectionTasksMap, taskId);

      // If over a task, find its container
      let overContainer: string | null = null;

      if (overId.startsWith("section:")) {
        // Directly over a section
        overContainer = overId.substring(8);
      } else if (overId.startsWith("task:")) {
        // Over another task, find its container
        overContainer = findContainer(sectionTasksMap, overId.substring(5));
      }

      if (
        !activeContainer ||
        !overContainer ||
        activeContainer === overContainer
      ) {
        return;
      }

      setItems((prev) => {
        const activeItems = [...prev[activeContainer]];
        const overItems = [...prev[overContainer!]];

        const activeIndex = activeItems.indexOf(`task:${taskId}`);

        // Remove from original container
        activeItems.splice(activeIndex, 1);

        // Add to new container at the end
        overItems.push(`task:${taskId}`);

        return {
          ...prev,
          [activeContainer]: activeItems,
          [overContainer!]: overItems,
        };
      });
    },
    [sectionTasksMap]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        setActiveId(null);
        setActiveTask(null);
        return;
      }

      const activeId = active.id as string;
      const overId = over.id as string;

      console.log("Drag end - Active ID:", activeId, "Over ID:", overId);

      // Extract the task ID from the prefixed format
      const taskId = activeId.startsWith("task:")
        ? activeId.substring(5)
        : activeId;

      // Find the containers
      const activeContainer = findContainer(sectionTasksMap, taskId);

      // If over a task, find its container
      let overContainer: string | null = null;
      let overIndex = -1;

      if (overId.startsWith("section:")) {
        // Directly over a section
        overContainer = overId.substring(8);
      } else if (overId.startsWith("task:")) {
        // Over another task, find its container
        const overTaskId = overId.substring(5);
        overContainer = findContainer(sectionTasksMap, overTaskId);

        if (overContainer) {
          // Find the index of the task we're over
          const overItems = sectionTasksMap.get(overContainer);
          overIndex = overItems.findIndex(
            (item: TaskType) => item.id === overTaskId
          );
        }
      }

      if (!activeContainer) {
        setActiveId(null);
        setActiveTask(null);
        return;
      }

      // Handle sorting within the same container
      if (activeContainer === overContainer) {
        const activeIndex = sectionTasksMap
          .get(activeContainer)
          .findIndex((item: TaskType) => item.id === taskId);

        if (activeIndex !== overIndex && overIndex !== -1) {
          // Update local state for immediate UI update
          setLocalTasks((prevTasks) => {
            const updatedTasks = [...prevTasks];
            const sectionTasks = [...sectionTasksMap.get(activeContainer)];
            const reorderedSectionTasks = arrayMove(
              sectionTasks,
              activeIndex,
              overIndex
            );

            // Update the tasks in the section with their new order
            reorderedSectionTasks.forEach((task) => {
              const taskIndex = updatedTasks.findIndex((t) => t.id === task.id);
              if (taskIndex !== -1) {
                updatedTasks[taskIndex] = {
                  ...updatedTasks[taskIndex],
                };
              }
            });

            return updatedTasks;
          });

          // Call API to update position
          moveTask({
            taskId,
            sectionId: activeContainer,
            position: overIndex,
          });
        }
      } else if (overContainer) {
        // Moving to a different container
        // Update local state for immediate UI update
        setLocalTasks((prevTasks) => {
          const updatedTasks = [...prevTasks];
          const taskIndex = updatedTasks.findIndex((t) => t.id === taskId);

          if (taskIndex !== -1) {
            // Update the task's section
            updatedTasks[taskIndex] = {
              ...updatedTasks[taskIndex],
              assigned_section: {
                ...updatedTasks[taskIndex].assigned_section,
                id: overContainer,
              },
            };
          }

          return updatedTasks;
        });

        // Calculate position - if over a task, use its position, otherwise add to the end
        const position =
          overIndex !== -1
            ? overIndex
            : sectionTasksMap.get(overContainer)?.length || 0;

        // Call API to update section and position
        moveTask({
          taskId,
          sectionId: overContainer,
          position,
        });
      }

      setActiveId(null);
      setActiveTask(null);
    },
    [sectionTasksMap, moveTask]
  );

  const handleCreateTask = useCallback((sectionId: string) => {
    setCreateTaskSection(sectionId);
    setShowCreateDialog(true);
  }, []);

  // Memoize the loading skeleton
  const loadingSkeleton = useMemo(
    () => (
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
    ),
    []
  );

  // Memoize the section cards rendering
  const sectionCards = useMemo(() => {
    if (!effectiveSections) return null;

    return effectiveSections.map((section) => {
      // Get tasks for this section
      const sectionTasks: TaskType[] = sectionTasksMap.get(section.id) || [];
      const sectionColor = sectionColors[section.name as keyof typeof sectionColors] || {
        bg: "#FFFFFF",
        header: "#F1F5F9",
      };
      const taskIds =
        items[section.id] || sectionTasks.map((task) => `task:${task.id}`);

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
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({sectionTasks.length})
                  </span>
                </CardTitle>
                <AdminWrapper>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-white hover:text-black transition"
                    onClick={() => handleCreateTask(section.id)}
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </AdminWrapper>
              </div>
            </CardHeader>

            {/* Task List */}
            <CardContent className="flex-1 overflow-y-auto p-4">
              <SortableContext
                items={taskIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 min-h-[150px]">
                  {sectionTasks.map((task) => (
                    <SortableTaskCard
                      key={task.id}
                      task={task}
                      id={task.id}
                      bgColor={`${section.color}`}
                    />
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
      );
    });
  }, [
    effectiveSections,
    sprintId,
    sectionTasksMap,
    items,
    sectionColors,
    handleCreateTask,
  ]);

  if (effectiveLoadingSections || (sprintId ? loadingSprintTasks : loadingProjectTasks)) {
    return loadingSkeleton;
  }

  // Debug information
  console.log('TaskBoard Debug:', {
    sprintId,
    localTasks: localTasks.length,
    effectiveSections: effectiveSections?.length,
    sectionTasksMap: Array.from(sectionTasksMap.entries()).map(([id, tasks]) => ({ sectionId: id, taskCount: tasks.length }))
  });

  // If no sections available, show a message
  if (!effectiveSections || effectiveSections.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <KanbanSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No board sections found</h3>
            <p className="text-muted-foreground mb-4">Create a board with sections to organize your tasks</p>
          </div>
        </CardContent>
      </Card>
    );
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
          {sectionCards}
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
  );
}
