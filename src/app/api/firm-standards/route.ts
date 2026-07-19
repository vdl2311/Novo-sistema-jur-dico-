export const dynamic = 'force-dynamic';

import { db } from '@/lib/db'

// GET /api/firm-standards
export async function GET() {
  const standards = await db.firmStandard.findMany({
    where: { active: true },
    orderBy: { category: 'asc' },
  })
  return Response.json(standards)
}

// POST /api/firm-standards
export async function POST(req: Request) {
  const body = await req.json()
  const std = await db.firmStandard.create({
    data: {
      category: body.category,
      name: body.name,
      value: body.value,
      description: body.description || null,
    },
  })
  return Response.json(std, { status: 201 })
}
