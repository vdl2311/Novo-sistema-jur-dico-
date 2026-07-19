export const dynamic = 'force-dynamic';

import { db } from '@/lib/db'

// GET /api/deadlines - lista de prazos com filtros
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const periodo = searchParams.get('periodo') || 'todos' // hoje, 7dias, 30dias, todos
  const done = searchParams.get('done')

  const hoje = new Date()
  const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
  const fimHoje = new Date(inicioHoje.getTime() + 86400000)

  const where: Record<string, unknown> = {}
  if (done === 'false') where.done = false
  if (done === 'true') where.done = true

  if (periodo === 'hoje') {
    where.dueDate = { gte: inicioHoje, lt: fimHoje }
  } else if (periodo === '7dias') {
    where.dueDate = {
      gte: inicioHoje,
      lte: new Date(hoje.getTime() + 7 * 86400000),
    }
  } else if (periodo === '30dias') {
    where.dueDate = {
      gte: inicioHoje,
      lte: new Date(hoje.getTime() + 30 * 86400000),
    }
  } else if (periodo === 'atrasados') {
    where.dueDate = { lt: inicioHoje }
    where.done = false
  }

  const deadlines = await db.deadline.findMany({
    where,
    include: { process: { include: { client: true } } },
    orderBy: { dueDate: 'asc' },
  })

  return Response.json(deadlines)
}

// POST /api/deadlines
export async function POST(req: Request) {
  const body = await req.json()
  const deadline = await db.deadline.create({
    data: {
      processId: body.processId,
      title: body.title,
      dueDate: new Date(body.dueDate),
      type: body.type || 'Interno',
      priority: body.priority || 'Média',
      responsible: body.responsible,
      notes: body.notes,
    },
  })

  await db.timelineEntry.create({
    data: {
      processId: body.processId,
      date: deadline.dueDate,
      type: 'Prazo',
      title: `Prazo: ${deadline.title}`,
      description: `${deadline.type} | ${deadline.priority}`,
    },
  })

  await db.auditLog.create({
    data: {
      user: 'Sistema',
      action: 'CREATE',
      entity: 'Deadline',
      entityId: deadline.id,
      details: `Prazo criado: ${deadline.title}`,
    },
  })

  return Response.json(deadline, { status: 201 })
}

// PATCH /api/deadlines?id=xxx
export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })

  const body = await req.json()
  // Mapear campos permitidos
  const allowedFields: Record<string, unknown> = {}
  for (const f of ['title', 'type', 'priority', 'responsible', 'done', 'notes', 'processId']) {
    if (body[f] !== undefined) allowedFields[f] = body[f]
  }
  if (body.dueDate) allowedFields.dueDate = new Date(body.dueDate)

  const updated = await db.deadline.update({
    where: { id },
    data: allowedFields,
  })

  return Response.json(updated)
}
