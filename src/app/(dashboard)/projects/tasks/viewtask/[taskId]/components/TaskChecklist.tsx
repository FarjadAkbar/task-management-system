"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { checkedListItem } from "@/actions/projects/checked-list-item"

interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

interface TaskChecklistProps {
  taskId: string
  initialChecklist: ChecklistItem[]
}

export function TaskChecklist({ taskId, initialChecklist }: TaskChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(Array.isArray(initialChecklist) ? initialChecklist : JSON.parse(initialChecklist))


  const handleCheckChange = async (id: string, checked: boolean) => {
    const updatedChecklist = checklist.map((item) => (item.id === id ? { ...item, checked } : item))
    setChecklist(updatedChecklist)
    await checkedListItem(taskId, id, checked)
  }

  return (
    <div className="space-y-2">
      {checklist?.map((item) => (
        <div key={item.id} className="flex items-center space-x-2">
          <Checkbox
            id={item.id}
            checked={item.checked}
            onCheckedChange={(checked) => handleCheckChange(item.id, checked as boolean)}
          />
          <label htmlFor={item.id} className={`text-sm ${item.checked ? "line-through text-muted-foreground" : ""}`}>
            {item.text}
          </label>
        </div>
      ))}
    </div>
  )
}

