"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Loader2 } from "lucide-react"
import { MultiSelect } from "@/components/ui/multi-select"
import { useGetUsersQuery } from "@/service/users"
import { useCreateTask } from "@/service/tasks"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  assignees: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sectionId: string | null
  sprintId?: string
  parentTaskId?: string
}

export function CreateTaskDialog({ open, onOpenChange, sectionId, sprintId, parentTaskId }: CreateTaskDialogProps) {
  const { mutate: createTask, isPending } = useCreateTask()
  const { data: usersData } = useGetUsersQuery({ search: "" })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      assignees: [],
      tags: [],
    },
  })

  const onSubmit = (values: FormValues) => {
    createTask(
      {
        ...values,
        section: sectionId || undefined,
        sprintId: sprintId,
        parentTaskId: parentTaskId,
      },
      {
        onSuccess: () => {
          toast({
            title: "Task created",
            description: "Your task has been created successfully",
          })
          onOpenChange(false)
        },
        onError: (error) => {
          toast({
            title: "Failed to create task",
            description: error.message,
            variant: "destructive",
          })
        },
      },
    )
  }

  // Prepare users for assignee selection
  const userOptions =
    usersData?.users.map((user) => ({
      label: user.name || user.email,
      value: user.id,
    })) || []

  // Common tag options
  const tagOptions = [
    { label: "Bug", value: "bug" },
    { label: "Feature", value: "feature" },
    { label: "Enhancement", value: "enhancement" },
    { label: "Documentation", value: "documentation" },
    { label: "Design", value: "design" },
    { label: "Testing", value: "testing" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task to your project</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignees</FormLabel>
                  <FormControl>
                    <MultiSelect
                      placeholder="Select assignees"
                      options={userOptions}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiSelect
                      placeholder="Select tags"
                      options={tagOptions}
                      selected={field.value || []}
                      onChange={field.onChange}
                      allowCreate
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" className="bg-gray-100 hover:bg-gray-300" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="bg-black text-gold hover:text-black hover:bg-gold">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Task"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

