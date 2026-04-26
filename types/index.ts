export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Category {
  id: string
  name: string
  color: string
  icon: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  title: string
  description: string | null
  dueDate: Date | null
  isCompleted: boolean
  priority: Priority
  categoryId: string
  category: Category
  createdAt: Date
  updatedAt: Date
}

export interface TaskFormData {
  title: string
  description?: string
  dueDate?: string
  priority: Priority
  categoryId: string
}
