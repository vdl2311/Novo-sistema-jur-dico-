export const dynamic = 'force-dynamic';

import { db } from '@/lib/db'

// GET /api/outcome-pricing
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const area = searchParams.get('area')

  const where: any = { active: true }
  if (area && area !== 'Todas') where.area = area

  const pricing = await db.outcomePricing.findMany({ where, orderBy: { area: 'asc' } })
  return Response.json(pricing)
}

// POST /api/outcome-pricing
export async function POST(req: Request) {
  const body = await req.json()
  const pricing = await db.outcomePricing.create({
    data: {
      name: body.name,
      description: body.description,
      basePrice: Number(body.basePrice),
      successPrice: Number(body.successPrice),
      successCriteria: body.successCriteria,
      area: body.area || 'Geral',
    },
  })
  return Response.json(pricing, { status: 201 })
}
