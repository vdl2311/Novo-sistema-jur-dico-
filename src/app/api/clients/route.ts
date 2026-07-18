import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/clients - lista com filtros opcionais
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''

  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { document: { contains: search } },
      { email: { contains: search } },
    ]
  }
  if (status && status !== 'Todos') where.status = status

  const clients = await db.client.findMany({
    where,
    include: {
      _count: {
        select: { processes: true, tasks: true, financials: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(clients)
}

// POST /api/clients - criar
export async function POST(req: NextRequest) {
  const body = await req.json()
  const client = await db.client.create({
    data: {
      name: body.name,
      type: body.type || 'PF',
      document: body.document,
      email: body.email,
      phone: body.phone,
      mobile: body.mobile,
      address: body.address,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      status: body.status || 'Prospect',
      tags: body.tags,
      notes: body.notes,
    },
  })

  await db.auditLog.create({
    data: {
      user: 'Sistema',
      action: 'CREATE',
      entity: 'Client',
      entityId: client.id,
      details: `Cliente criado: ${client.name}`,
    },
  })

  return NextResponse.json(client, { status: 201 })
}
