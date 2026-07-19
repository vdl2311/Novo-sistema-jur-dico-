'use client'

import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'
import { CommandPalette } from '@/components/command-palette'
import { LoginScreen } from '@/components/login-screen'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { db } from '@/lib/db'
import { Scale } from 'lucide-react'
import { DashboardView } from '@/components/views/dashboard-view'
import { ProcessesView } from '@/components/views/processes-view'
import { ProcessDetail } from '@/components/views/process-detail'
import { ClientsView } from '@/components/views/clients-view'
import { DeadlinesView } from '@/components/views/deadlines-view'
import { TasksView } from '@/components/views/tasks-view'
import { FinancialView } from '@/components/views/financial-view'
import { CopilotView } from '@/components/views/copilot-view'
import { AgendaView } from '@/components/views/agenda-view'
import { TeamView } from '@/components/views/team-view'
import { AdminView } from '@/components/views/admin-view'
import { ReportsView } from '@/components/views/reports-view'
import { ContractsView } from '@/components/views/contracts-view'
import { AutomationsView } from '@/components/views/automations-view'
import { PortalView } from '@/components/views/portal-view'
import { NotificationsView } from '@/components/views/notifications-view'
import { AiJuridicaView } from '@/components/views/ai-juridica-view'
import { ConflictsView } from '@/components/views/conflicts-view'
import { DatajudView } from '@/components/views/datajud-view'
import { AgentsView } from '@/components/views/agents-view'
import { KnowledgeView } from '@/components/views/knowledge-view'
import { ComplianceView } from '@/components/views/compliance-view'

export type ViewName =
  | 'dashboard'
  | 'processes'
  | 'process-detail'
  | 'clients'
  | 'deadlines'
  | 'tasks'
  | 'financial'
  | 'copilot'
  | 'ai-juridica'
  | 'agenda'
  | 'team'
  | 'admin'
  | 'reports'
  | 'contracts'
  | 'documents'
  | 'automations'
  | 'portal'
  | 'notifications'
  | 'conflicts'
  | 'datajud'
  | 'agents'
  | 'knowledge'
  | 'compliance'

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [view, setView] = useState<ViewName>('dashboard')
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [commandOpen, setCommandOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [restoringSession, setRestoringSession] = useState(true)

  // Estado de carregamento detalhado de clientes e membros para diagnóstico de conexão do Firestore
  const [diagnosticLoading, setDiagnosticLoading] = useState({
    loading: false,
    clientsStatus: 'idle' as 'idle' | 'loading' | 'success' | 'error',
    membersStatus: 'idle' as 'idle' | 'loading' | 'success' | 'error',
    clientsCount: 0,
    membersCount: 0,
    clientsError: null as string | null,
    membersError: null as string | null,
  })

  // Carregamento detalhado de clientes e membros para diagnóstico no Vercel/Firestore
  useEffect(() => {
    if (!user) return

    const loadClientsAndMembers = async () => {
      console.log("[Firestore Load Diagnostic] Iniciando carregamento detalhado de dados...")
      setDiagnosticLoading(prev => ({
        ...prev,
        loading: true,
        clientsStatus: 'loading',
        membersStatus: 'loading',
        clientsError: null,
        membersError: null,
      }))

      // 1. Carregar Clientes
      try {
        console.log("[Firestore Load Diagnostic] Buscando 'clients' do Firestore via db.client...")
        const clientsList = await db.client.findMany()
        console.log(`[Firestore Load Diagnostic] Clientes carregados com sucesso! Total: ${clientsList.length}`)
        setDiagnosticLoading(prev => ({
          ...prev,
          clientsStatus: 'success',
          clientsCount: clientsList.length,
        }))
      } catch (error: any) {
        const errorDetails = {
          message: error?.message || String(error),
          code: error?.code,
          name: error?.name,
          stack: error?.stack,
        }
        console.error("🚨 [Firestore Load Diagnostic] Erro de leitura ou permissão ao buscar CLIENTES:", errorDetails)
        setDiagnosticLoading(prev => ({
          ...prev,
          clientsStatus: 'error',
          clientsError: error?.message || String(error),
        }))
      }

      // 2. Carregar Membros
      try {
        console.log("[Firestore Load Diagnostic] Buscando 'users' (membros) do Firestore via db.user...")
        const membersList = await db.user.findMany()
        console.log(`[Firestore Load Diagnostic] Membros carregados com sucesso! Total: ${membersList.length}`)
        setDiagnosticLoading(prev => ({
          ...prev,
          membersStatus: 'success',
          membersCount: membersList.length,
        }))
      } catch (error: any) {
        const errorDetails = {
          message: error?.message || String(error),
          code: error?.code,
          name: error?.name,
          stack: error?.stack,
        }
        console.error("🚨 [Firestore Load Diagnostic] Erro de leitura ou permissão ao buscar MEMBROS (users):", errorDetails)
        setDiagnosticLoading(prev => ({
          ...prev,
          membersStatus: 'error',
          membersError: error?.message || String(error),
        }))
      } finally {
        setDiagnosticLoading(prev => ({
          ...prev,
          loading: false,
        }))
      }
    }

    loadClientsAndMembers()
  }, [user])

  // Persistir sessão e escutar estado do Firebase Auth
  useEffect(() => {
    let localSession: any = null;
    try {
      const stored = localStorage.getItem('user_session')
      if (stored) {
        localSession = JSON.parse(stored)
        setUser(localSession)
      }
    } catch (e) {
      console.warn("localStorage não disponível:", e)
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await db.user.findUnique({ where: { email: firebaseUser.email } })
          const sessionUser = userDoc ? {
            id: userDoc.id,
            name: userDoc.name,
            email: userDoc.email,
            role: userDoc.role,
          } : {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Advogado',
            email: firebaseUser.email || '',
            role: 'Advogado',
          };
          setUser(sessionUser)
          try {
            localStorage.setItem('user_session', JSON.stringify(sessionUser))
          } catch (err) {}
        } catch (e) {
          console.error("Erro ao carregar dados do usuário:", e)
        }
      } else {
        if (!localSession) {
          setUser(null)
        }
      }
      setRestoringSession(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogin = (u: User) => {
    try {
      localStorage.setItem('user_session', JSON.stringify(u))
    } catch (err) {}
    setUser(u)
  }

  const handleLogout = async () => {
    try {
      localStorage.removeItem('user_session')
    } catch (err) {}
    try {
      await signOut(auth)
      setUser(null)
    } catch (e) {
      console.error("Erro ao fazer logout:", e)
      setUser(null)
    }
  }

  // Atalho Cmd+K
  useEffect(() => {
    if (!user) return
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [user])

  // Listener para eventos de navegação global
  useEffect(() => {
    if (!user) return
    const navigateHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail as ViewName
      if (detail) setView(detail)
    }
    const openDatajudHandler = () => {}
    window.addEventListener('navigate', navigateHandler)
    window.addEventListener('open-datajud', openDatajudHandler)
    return () => {
      window.removeEventListener('navigate', navigateHandler)
      window.removeEventListener('open-datajud', openDatajudHandler)
    }
  }, [user])

  const openProcess = useCallback((id: string) => {
    setSelectedProcessId(id)
    setView('process-detail')
    setMobileSidebarOpen(false)
  }, [])

  const openClient = useCallback((id: string) => {
    setSelectedClientId(id)
    setView('clients')
    setMobileSidebarOpen(false)
  }, [])

  const navigate = useCallback((v: ViewName) => {
    setView(v)
    setMobileSidebarOpen(false)
  }, [])

  if (restoringSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center animate-pulse">
          <Scale className="h-6 w-6 animate-bounce" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse font-medium">Restaurando sessão segura...</p>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />
  }

  // Portal do cliente é tela cheia (sem sidebar)
  if (view === 'portal') {
    return <PortalView />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar desktop */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar
          current={view}
          onNavigate={navigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        />
      </div>

      {/* Sidebar mobile (drawer com overlay) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full animate-in slide-in-from-left duration-200">
            <Sidebar
              current={view}
              onNavigate={navigate}
              collapsed={false}
              onToggleCollapse={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0 h-full">
        <TopBar
          onOpenSearch={() => setCommandOpen(true)}
          onOpenCopilot={() => setView('copilot')}
          view={view}
          user={user}
          onLogout={handleLogout}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* Barra de Status de Diagnóstico do Firestore */}
        {(diagnosticLoading.loading || diagnosticLoading.clientsStatus === 'error' || diagnosticLoading.membersStatus === 'error') && (
          <div className={`px-4 py-2 text-xs flex items-center justify-between border-b transition-colors shrink-0 ${
            diagnosticLoading.clientsStatus === 'error' || diagnosticLoading.membersStatus === 'error'
              ? 'bg-destructive/10 border-destructive/20 text-destructive'
              : 'bg-muted/50 border-muted text-muted-foreground'
          }`}>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  diagnosticLoading.clientsStatus === 'error' || diagnosticLoading.membersStatus === 'error'
                    ? 'bg-red-400'
                    : 'bg-amber-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  diagnosticLoading.clientsStatus === 'error' || diagnosticLoading.membersStatus === 'error'
                    ? 'bg-red-500'
                    : 'bg-amber-500'
                }`}></span>
              </span>
              <span className="font-semibold">Status Firestore:</span>
              <span>
                {diagnosticLoading.loading
                  ? 'Diagnosticando leitura de clientes e membros...'
                  : `Clientes: ${diagnosticLoading.clientsStatus === 'error' ? 'Erro de leitura (detalhes no console)' : `${diagnosticLoading.clientsCount} cadastrados`} | ` +
                    `Membros: ${diagnosticLoading.membersStatus === 'error' ? 'Erro de leitura (detalhes no console)' : `${diagnosticLoading.membersCount} ativos`}`
                }
              </span>
            </div>
            {(diagnosticLoading.clientsStatus === 'error' || diagnosticLoading.membersStatus === 'error') && (
              <div className="text-[10px] font-mono max-w-[50%] truncate hidden sm:block">
                Erro: {diagnosticLoading.clientsError || diagnosticLoading.membersError}
              </div>
            )}
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          {view === 'dashboard' && (
            <DashboardView onOpenProcess={openProcess} onNavigate={navigate} />
          )}
          {view === 'processes' && (
            <ProcessesView onOpenProcess={openProcess} onNavigate={navigate} />
          )}
          {view === 'process-detail' && selectedProcessId && (
            <ProcessDetail
              processId={selectedProcessId}
              onBack={() => setView('processes')}
              onOpenClient={openClient}
            />
          )}
          {view === 'clients' && (
            <ClientsView selectedId={selectedClientId} onOpenProcess={openProcess} />
          )}
          {view === 'deadlines' && <DeadlinesView onOpenProcess={openProcess} />}
          {view === 'tasks' && <TasksView onOpenProcess={openProcess} />}
          {view === 'financial' && <FinancialView />}
          {view === 'copilot' && (
            <CopilotView onOpenProcess={openProcess} onNavigate={navigate} />
          )}
          {view === 'ai-juridica' && <AiJuridicaView />}
          {view === 'agenda' && <AgendaView onOpenProcess={openProcess} />}
          {view === 'team' && <TeamView />}
          {view === 'admin' && <AdminView />}
          {view === 'reports' && <ReportsView />}
          {view === 'contracts' && <ContractsView />}
          {view === 'documents' && <DocumentsView />}
          {view === 'automations' && <AutomationsView />}
          {view === 'notifications' && <NotificationsView />}
          {view === 'conflicts' && <ConflictsView />}
          {view === 'datajud' && <DatajudView />}
          {view === 'agents' && <AgentsView />}
          {view === 'knowledge' && <KnowledgeView />}
          {view === 'compliance' && <ComplianceView />}
        </main>
      </div>

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onOpenProcess={openProcess}
        onNavigate={navigate}
      />
    </div>
  )
}

function DocumentsView() {
  return (
    <div className="p-4 md:p-6">
      <div className="rounded-lg border border-border p-8 md:p-12 text-center">
        <p className="text-sm text-muted-foreground">
          Módulo de documentos integrado aos processos e contratos. Acesse via detalhe do processo ou pelo módulo de Contratos.
        </p>
      </div>
    </div>
  )
}
