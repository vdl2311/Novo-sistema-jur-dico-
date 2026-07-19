export const dynamic = 'force-dynamic';

import { db } from '@/lib/db'

// GET /api/audit - logs de auditoria
export async function GET() {
  const logs = await db.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  return Response.json(logs)
}
