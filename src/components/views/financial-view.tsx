'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, Wallet } from 'lucide-react'
import { formatCurrency, formatDate, statusColor } from '@/lib/format'
import { cn } from '@/lib/utils'

interface Financial {
  id: string
  type: string
  category: string
  description: string
  amount: number
  dueDate: string
  paidDate: string | null
  status: string
  client: { name: string } | null
  process: { title: string } | null
}

export function FinancialView() {
  const convexFinancial = useQuery(api.financial.list)
  const markAsPaid = useMutation(api.financial.markAsPaid)
  const [tab, setTab] = useState('todos')

  const loading = convexFinancial === undefined
  const allItems = convexFinancial || []
  
  const items = allItems.filter(i => {
    if (tab === 'todos') return true
    if (tab === 'receitas') return i.type === 'Receita'
    if (tab === 'despesas') return i.type === 'Despesa'
    return true
  })

  const markPaid = async (id: any) => {
    await markAsPaid({ id })
  }

  const totalReceita = items.filter((i) => i.type === 'Receita' && i.status === 'Pago').reduce((s, i) => s + i.amount, 0)
  const totalDespesa = items.filter((i) => i.type === 'Despesa' && i.status === 'Pago').reduce((s, i) => s + i.amount, 0)
  const aReceber = items.filter((i) => i.type === 'Receita' && i.status !== 'Pago').reduce((s, i) => s + i.amount, 0)
  const aPagar = items.filter((i) => i.type === 'Despesa' && i.status !== 'Pago').reduce((s, i) => s + i.amount, 0)
  const saldo = totalReceita - totalDespesa

  // Agregar por categoria
  const porCategoria: Record<string, { receita: number; despesa: number }> = {}
  for (const i of items) {
    if (i.status !== 'Pago') continue
    if (!porCategoria[i.category]) porCategoria[i.category] = { receita: 0, despesa: 0 }
    if (i.type === 'Receita') porCategoria[i.category].receita += i.amount
    else porCategoria[i.category].despesa += i.amount
  }
  const chartData = Object.entries(porCategoria).map(([cat, v]) => ({
    categoria: cat,
    receita: v.receita,
    despesa: v.despesa,
  }))

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Recebido</p>
              <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-xl font-semibold mt-1 text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalReceita)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Pago</p>
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-xl font-semibold mt-1 text-red-600 dark:text-red-400">
              {formatCurrency(totalDespesa)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">A receber</p>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-xl font-semibold mt-1">{formatCurrency(aReceber)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Saldo</p>
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <p className={cn('text-xl font-semibold mt-1', saldo >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
              {formatCurrency(saldo)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico por categoria */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Receitas e despesas por categoria</CardTitle>
          <CardDescription>Apenas lançamentos pagos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0 0 / 0.5)" />
                <XAxis dataKey="categoria" stroke="oklch(0.52 0 0)" fontSize={11} />
                <YAxis stroke="oklch(0.52 0 0)" fontSize={11} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 8, border: '1px solid oklch(0.91 0 0)', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="receita" name="Receita" fill="oklch(0.55 0.13 155)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesa" name="Despesa" fill="oklch(0.62 0.22 25)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 rounded-md bg-muted/40 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-sm text-muted-foreground">
                Nenhum lançamento encontrado.
              </CardContent>
            </Card>
          ) : (
            <ul className="space-y-2">
              {items.map((f: any) => (
                <Card key={f._id}>
                  <CardContent className="p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={cn(
                        'h-9 w-9 rounded-md flex items-center justify-center shrink-0',
                        f.type === 'Receita' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                      )}>
                        {f.type === 'Receita' ? <ArrowUpCircle className="h-5 w-5" /> : <ArrowDownCircle className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{f.description}</p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-muted-foreground">{f.category}</span>
                          {f.clientName && <span className="text-[10px] text-muted-foreground">• {f.clientName}</span>}
                          <span className="text-[10px] text-muted-foreground">• Venc.: {formatDate(f.dueDate)}</span>
                          {f.paidDate && <span className="text-[10px] text-muted-foreground">• Pago: {formatDate(f.paidDate)}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <p className={cn(
                          'text-sm font-semibold',
                          f.type === 'Receita' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                        )}>
                          {f.type === 'Receita' ? '+' : '-'} {formatCurrency(f.amount)}
                        </p>
                        <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-medium', statusColor(f.status))}>
                          {f.status}
                        </span>
                      </div>
                      {f.status !== 'Pago' && (
                        <Button size="sm" variant="outline" onClick={() => markPaid(f._id)} className="hidden md:flex">
                          Marcar pago
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
