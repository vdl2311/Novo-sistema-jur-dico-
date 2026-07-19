export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/portal?token=xxx - Portal do cliente (acesso via token)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token necessário' }, { status: 401 })
  }

  const client = await db.client.findFirst({ where: { portalToken: token } })

  // Demo: se token for "demo", usar primeiro cliente ativo
  let cliente = client
  if (!cliente && token === 'demo') {
    cliente = await db.client.findFirst({ where: { status: 'Ativo' } })
    if (!cliente) {
      cliente = await db.client.findFirst() // fallback to any client for demo
    }
  }

  if (!cliente) {
    // Return mock data for demo purposes if no clients exist at all
    return NextResponse.json({
      cliente: {
        id: 'mock-1',
        name: 'Cliente Demonstração',
        email: 'demo@jurisistem.com',
        type: 'PF',
      },
      processes: [
        {
          id: 'proc-1',
          title: 'Ação Indenizatória',
          cnj: '0001234-56.2024.8.26.0000',
          status: 'Ativo',
          area: 'Cível',
          ultimoAndamento: { description: 'Petição Inicial Juntada' },
          atualizadoEm: new Date().toISOString(),
        }
      ],
      documents: [
        {
          id: 'doc-1',
          name: 'Procuração.pdf',
          type: 'PDF',
          size: 150000,
          createdAt: new Date().toISOString(),
        }
      ],
      financials: [
        {
          id: 'fin-1',
          description: 'Honorários Iniciais',
          amount: 5000,
          dueDate: new Date().toISOString(),
          status: 'Pendente',
          type: 'Receita',
        }
      ],
      contracts: [],
      resumo: {
        processosAtivos: 1,
        documentos: 1,
        aPagar: 5000,
        contratos: 0,
      }
    })
  }

  const [processes, documents, financials, contracts] = await Promise.all([
    db.process.findMany({
      where: { clientId: cliente.id },
      include: { movements: { orderBy: { date: 'desc' }, take: 3 } },
      orderBy: { updatedAt: 'desc' },
    }),
    db.document.findMany({
      where: { clientId: cliente.id },
      orderBy: { createdAt: 'desc' },
    }),
    db.financial.findMany({
      where: { clientId: cliente.id },
      orderBy: { dueDate: 'desc' },
    }),
    db.contract.findMany({
      where: { clientId: cliente.id, status: 'Assinado' },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return NextResponse.json({
    cliente: {
      id: cliente.id,
      name: cliente.name,
      email: cliente.email,
      type: cliente.type,
    },
    processes: processes.map((p) => ({
      id: p.id,
      title: p.title,
      cnj: p.cnj,
      status: p.status,
      area: p.area,
      ultimoAndamento: p.movements[0] || null,
      atualizadoEm: p.updatedAt,
    })),
    documents: documents.map((d) => ({
      id: d.id,
      name: d.name,
      type: d.type,
      size: d.size,
      createdAt: d.createdAt,
    })),
    financials: financials.map((f) => ({
      id: f.id,
      description: f.description,
      amount: f.amount,
      dueDate: f.dueDate,
      status: f.status,
      type: f.type,
    })),
    contracts: contracts.map((c) => ({
      id: c.id,
      title: c.title,
      signedAt: c.signedAt,
    })),
    resumo: {
      processosAtivos: processes.filter((p) => p.status === 'Ativo').length,
      documentos: documents.length,
      aPagar: financials
        .filter((f) => f.type === 'Receita' && f.status !== 'Pago')
        .reduce((s, f) => s + f.amount, 0),
      contratos: contracts.length,
    },
  })
}
