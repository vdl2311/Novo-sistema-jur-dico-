export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/tasks
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const assignee = searchParams.get('assignee')

  const where: Record<string, unknown> = {}
  if (status && status !== 'Todas') where.status = status
  if (assignee && assignee !== 'Todos') where.assignee = assignee

  const tasks = await db.task.findMany({
    where,
    include: { process: true, client: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(tasks)
}

// POST /api/tasks
export async function POST(req: NextRequest) {
  const body = await req.json()
  const task = await db.task.create({
    data: {
      title: body.title,
      description: body.description,
      status: body.status || 'A Fazer',
      priority: body.priority || 'Média',
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      assignee: body.assignee,
      processId: body.processId || null,
      clientId: body.clientId || null,
    },
  })

  await db.auditLog.create({
    data: {
      user: 'Sistema',
      action: 'CREATE',
      entity: 'Task',
      entityId: task.id,
      details: `Tarefa criada: ${task.title}`,
    },
  })

  return NextResponse.json(task, { status: 201 })
}

// PATCH /api/tasks?id=xxx
export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const body = await req.json()
  const updated = await db.task.update({
    where: { id },
    data: {
      ...body,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
    },
  })

  return NextResponse.json(updated)
}

// DELETE /api/tasks?id=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  await db.task.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
