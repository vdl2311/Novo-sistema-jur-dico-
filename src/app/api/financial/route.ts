export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/financial
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') // Receita, Despesa
  const status = searchParams.get('status')

  const where: Record<string, unknown> = {}
  if (type && type !== 'Todos') where.type = type
  if (status && status !== 'Todos') where.status = status

  const items = await db.financial.findMany({
    where,
    include: { client: true, process: true },
    orderBy: { dueDate: 'desc' },
  })

  return NextResponse.json(items)
}

// POST /api/financial
export async function POST(req: NextRequest) {
  const body = await req.json()
  const fin = await db.financial.create({
    data: {
      type: body.type,
      category: body.category,
      description: body.description,
      amount: Number(body.amount),
      dueDate: new Date(body.dueDate),
      paidDate: body.paidDate ? new Date(body.paidDate) : null,
      status: body.status || 'Pendente',
      processId: body.processId || null,
      clientId: body.clientId || null,
    },
  })

  await db.auditLog.create({
    data: {
      user: 'Sistema',
      action: 'CREATE',
      entity: 'Financial',
      entityId: fin.id,
      details: `Lançamento: ${fin.description} - R$ ${fin.amount}`,
    },
  })

  return NextResponse.json(fin, { status: 201 })
}

// PATCH /api/financial?id=xxx
export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const body = await req.json()
  const updated = await db.financial.update({
    where: { id },
    data: {
      ...body,
      amount: body.amount !== undefined ? Number(body.amount) : undefined,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      paidDate: body.paidDate ? new Date(body.paidDate) : body.paidDate === null ? null : undefined,
    },
  })

  return NextResponse.json(updated)
}
