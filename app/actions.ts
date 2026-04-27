'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { TaskFormData } from '@/types'

export interface CategoryFormData {
  name: string
  color: string
  icon?: string
}

// --- GET ALL TASKS (with optional category filter) ---
export async function getTasks(categoryId?: string) {
  return prisma.task.findMany({
    where: categoryId ? { categoryId } : undefined,
    include: { category: true },
    orderBy: [{ isCompleted: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
  })
}

// --- GET UPCOMING TASKS (due within 7 days, not completed) ---
export async function getUpcomingTasks() {
  const now = new Date()
  const sevenDaysLater = new Date()
  sevenDaysLater.setDate(now.getDate() + 7)

  return prisma.task.findMany({
    where: {
      isCompleted: false,
      dueDate: { gte: now, lte: sevenDaysLater },
    },
    include: { category: true },
    orderBy: { dueDate: 'asc' },
    take: 5,
  })
}

// --- GET DASHBOARD STATS ---
export async function getDashboardStats() {
  const [total, completed, upcoming, overdue] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({ where: { isCompleted: true } }),
    prisma.task.count({
      where: {
        isCompleted: false,
        dueDate: { gte: new Date() },
      },
    }),
    prisma.task.count({
      where: {
        isCompleted: false,
        dueDate: { lt: new Date() },
      },
    }),
  ])

  return { total, completed, upcoming, overdue, pending: total - completed }
}

// --- CREATE TASK ---
export async function createTask(data: TaskFormData) {
  await prisma.task.create({
    data: {
      title: data.title,
      description: data.description || null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      priority: data.priority,
      categoryId: data.categoryId,
    },
  })
  revalidatePath('/')
  revalidatePath('/tasks')
}

// --- UPDATE TASK ---
export async function updateTask(id: string, data: Partial<TaskFormData>) {
  await prisma.task.update({
    where: { id },
    data: {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    },
  })
  revalidatePath('/')
  revalidatePath('/tasks')
}

// --- TOGGLE TASK COMPLETE ---
export async function toggleTaskComplete(id: string, isCompleted: boolean) {
  await prisma.task.update({
    where: { id },
    data: { isCompleted },
  })
  revalidatePath('/')
  revalidatePath('/tasks')
}

// --- DELETE TASK ---
export async function deleteTask(id: string) {
  await prisma.task.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/tasks')
}

// --- GET ALL CATEGORIES ---
export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { tasks: true } },
    },
  })
}

// --- CREATE CATEGORY ---
export async function createCategory(data: CategoryFormData) {
  await prisma.category.create({
    data: {
      name: data.name,
      color: data.color,
      icon: data.icon || null,
    },
  })
  revalidatePath('/')
  revalidatePath('/categories')
  revalidatePath('/tasks')
}

// --- UPDATE CATEGORY ---
export async function updateCategory(id: string, data: CategoryFormData) {
  await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      color: data.color,
      icon: data.icon || null,
    },
  })
  revalidatePath('/')
  revalidatePath('/categories')
  revalidatePath('/tasks')
}

// --- DELETE CATEGORY ---
export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/categories')
  revalidatePath('/tasks')
}
