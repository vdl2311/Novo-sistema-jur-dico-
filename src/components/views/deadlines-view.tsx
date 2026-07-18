'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { AlarmClock, CheckSquare, ChevronRight } from 'lucide-react'
import { priorityColor, formatDate, relativeDate, daysUntil, statusColor } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface Deadline {
  id: string
  title: string
  dueDate: string
  type: string
  priority: string
  responsible: string | null
  done: boolean
  notes: string | null
  process: { id: string; title: string; client: { name: string } } | null
}

interface Props {
  onOpenProcess: (id: string) => void
}

export function DeadlinesView({ onOpenProcess }: Props) {
  const convexDeadlines = useQuery(api.deadlines.list)
  const completeDeadline = useMutation(api.deadlines.complete)
  
  const [periodo, setPeriodo] = useState('7dias')
  const { toast } = useToast()

  const items = (convexDeadlines || []).filter(d => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const deadlineDate = new Date(d.dueDate)
    
    if (periodo === 'hoje') {
      return deadlineDate.toDateString() === today.toDateString()
    }
    if (periodo === '7dias') {
      const weekFromNow = new Date()
      weekFromNow.setDate(today.getDate() + 7)
      return deadlineDate >= today && deadlineDate <= weekFromNow
    }
    if (periodo === 'atrasados') {
      return deadlineDate < today && d.status !== 'Concluído'
    }
    return true
  })

  const loading = convexDeadlines === undefined

  const toggleDone = async (d: any) => {
    try {
      await completeDeadline({ id: d._id })
      toast({
        title: 'Prazo concluído',
        description: d.title,
      })
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Falha ao atualizar prazo.',
        variant: 'destructive',
      })
    }
  }

  const grouped: Record<string, Deadline[]> = {}
  for (const d of items) {
    const key = formatDate(new Date(d.dueDate).toISOString())
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(d)
  }
  const dates = Object.keys(grouped).sort((a, b) => {
    const da = new Date(a.split('/').reverse().join('-')).getTime()
    const db = new Date(b.split('/').reverse().join('-')).getTime()
    return da - db
  })

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Tabs value={periodo} onValueChange={setPeriodo}>
        <TabsList>
          <TabsTrigger value="hoje">Hoje</TabsTrigger>
          <TabsTrigger value="7dias">7 dias</TabsTrigger>
          <TabsTrigger value="30dias">30 dias</TabsTrigger>
          <TabsTrigger value="atrasados">Atrasados</TabsTrigger>
          <TabsTrigger value="todos">Todos</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-md bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlarmClock className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {periodo === 'atrasados' ? 'Nenhum prazo atrasado. Bom trabalho!' : 'Nenhum prazo neste período.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {dates.map((date) => (
            <div key={date} className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{date}</h3>
                <Badge variant="outline" className="text-[10px]">
                  {grouped[date].length} {grouped[date].length === 1 ? 'prazo' : 'prazos'}
                </Badge>
              </div>
              <ul className="space-y-2">
                {grouped[date].map((d: any) => {
                  const deadlineISO = new Date(d.dueDate).toISOString()
                  const dias = daysUntil(deadlineISO)
                  const isDone = d.status === 'Concluído'
                  const atrasado = dias < 0 && !isDone
                  return (
                    <Card
                      key={d._id}
                      className={cn(atrasado && 'border-red-300 dark:border-red-900/50')}
                    >
                      <CardContent className="p-3.5 flex items-start gap-3">
                        <button
                          onClick={() => toggleDone(d)}
                          className={cn(
                            'mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                            isDone ? 'bg-emerald-500 border-emerald-500' : 'border-input hover:border-primary'
                          )}
                        >
                          {isDone && <CheckSquare className="h-3.5 w-3.5 text-white" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm font-medium', isDone && 'line-through text-muted-foreground')}>
                            {d.title}
                          </p>
                          {d.processNumber && (
                            <button
                              onClick={() => d.processId && onOpenProcess(d.processId)}
                              className="text-[11px] text-muted-foreground hover:text-primary truncate block mt-0.5"
                            >
                              Proc: {d.processNumber}
                            </button>
                          )}
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-medium', priorityColor(d.priority))}>
                              {d.priority}
                            </span>
                            
                            <span className={cn(
                              'text-[10px] font-medium',
                              atrasado ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
                            )}>
                              • {relativeDate(deadlineISO)}
                            </span>
                          </div>
                          {d.description && <p className="text-[11px] text-muted-foreground mt-1">{d.description}</p>}
                        </div>

                        {d.processId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenProcess(d.processId!)}
                            className="shrink-0"
                          >
                            Abrir
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
