// Component prop types and UI-related types

import { LucideIcon } from 'lucide-react'

export interface DashboardCardProps {
  title: string
  icon: LucideIcon
  href: string
  description?: string
  className?: string
}

export interface ProjectCardProps {
  project: {
    id: string
    name: string
    description?: string
    status: string
    progress: number
    memberCount: number
    taskCount: number
  }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export interface TaskCardProps {
  task: {
    id: string
    title: string
    description?: string
    status: string
    priority: string
    assignee?: {
      id: string
      name: string
      avatar?: string
    }
    dueDate?: string
  }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export interface UserCardProps {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    role: string
    department?: string
    isOnline?: boolean
  }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea' | 'select'
  placeholder?: string
  required?: boolean
  error?: string
  options?: { value: string; label: string }[]
}
