'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'
import { CommandPalette } from '@/components/command-palette'
import { LoginScreen } from '@/components/login-screen'
import { Sheet, SheetContent } from '@/components/ui/sheet'

// Views
import { DashboardView } from '@/components/views/dashboard-view'
import { CopilotView } from '@/components/views/copilot-view'
import { AiJuridicaView } from '@/components/views/ai-juridica-view'
import { AgentsView } from '@/components/views/agents-view'
import { ProcessesView } from '@/components/views/processes-view'
import { DatajudView } from '@/components/views/datajud-view'
import { AgendaView } from '@/components/views/agenda-view'
import { DeadlinesView } from '@/components/views/deadlines-view'
import { TasksView } from '@/components/views/tasks-view'
import { ClientsView } from '@/components/views/clients-view'
import { FinancialView } from '@/components/views/financial-view'
import { ContractsView } from '@/components/views/contracts-view'
import { KnowledgeView } from '@/components/views/knowledge-view'
import { ComplianceView } from '@/components/views/compliance-view'
import { NotificationsView } from '@/components/views/notifications-view'
import { ConflictsView } from '@/components/views/conflicts-view'
import { ReportsView } from '@/components/views/reports-view'
import { TeamView } from '@/components/views/team-view'
import { AdminView } from '@/components/views/admin-view'
import { PortalView } from '@/components/views/portal-view'
import { AutomationsView } from '@/components/views/automations-view'
import { ProcessDetail } from '@/components/views/process-detail'

export type ViewName =
  | 'dashboard'
  | 'copilot'
  | 'ai-juridica'
  | 'agents'
  | 'processes'
  | 'process-detail'
  | 'datajud'
  | 'agenda'
  | 'deadlines'
  | 'tasks'
  | 'clients'
  | 'financial'
  | 'contracts'
  | 'documents'
  | 'automations'
  | 'knowledge'
  | 'compliance'
  | 'notifications'
  | 'conflicts'
  | 'reports'
  | 'team'
  | 'admin'
  | 'portal'

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewName>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeProcessId, setActiveProcessId] = useState<string | null>(null)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(() => {
    const saved = localStorage.getItem('jusflow_user')
    return saved ? JSON.parse(saved) : null
  })

  const handleLogin = (userData: { id: string; name: string; email: string; role: string }) => {
    setUser(userData)
    localStorage.setItem('jusflow_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('jusflow_user')
  }

  const handleOpenProcess = (id: string) => {
    setActiveProcessId(id)
  }

  const handleNavigate = (v: ViewName) => {
    setCurrentView(v)
    setActiveProcessId(null)
    setMobileSidebarOpen(false)
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const renderActiveView = () => {
    if (activeProcessId) {
      return (
        <ProcessDetail
          processId={activeProcessId}
          onBack={() => setActiveProcessId(null)}
          onOpenClient={(clientId) => {
            setSelectedClientId(clientId)
            setCurrentView('clients')
            setActiveProcessId(null)
          }}
        />
      )
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardView onOpenProcess={handleOpenProcess} onNavigate={handleNavigate} />
      case 'copilot':
        return <CopilotView onOpenProcess={handleOpenProcess} onNavigate={handleNavigate} />
      case 'ai-juridica':
        return <AiJuridicaView />
      case 'agents':
        return <AgentsView />
      case 'processes':
        return <ProcessesView onOpenProcess={handleOpenProcess} onNavigate={handleNavigate} />
      case 'datajud':
        return <DatajudView />
      case 'agenda':
        return <AgendaView onOpenProcess={handleOpenProcess} />
      case 'deadlines':
        return <DeadlinesView onOpenProcess={handleOpenProcess} />
      case 'tasks':
        return <TasksView onOpenProcess={handleOpenProcess} />
      case 'clients':
        return <ClientsView selectedId={selectedClientId} onOpenProcess={handleOpenProcess} />
      case 'financial':
        return <FinancialView />
      case 'contracts':
      case 'documents':
        return <ContractsView />
      case 'automations':
        return <AutomationsView />
      case 'knowledge':
        return <KnowledgeView />
      case 'compliance':
        return <ComplianceView />
      case 'notifications':
        return <NotificationsView />
      case 'conflicts':
        return <ConflictsView />
      case 'reports':
        return <ReportsView />
      case 'team':
        return <TeamView />
      case 'admin':
        return <AdminView />
      case 'portal':
        return <PortalView />
      default:
        return <DashboardView onOpenProcess={handleOpenProcess} onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block h-full shrink-0">
        <Sidebar
          current={currentView}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Sidebar - Mobile */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[244px] border-r-0">
          <Sidebar
            current={currentView}
            onNavigate={handleNavigate}
            collapsed={false}
            onToggleCollapse={() => setMobileSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <TopBar
          onOpenSearch={() => setSearchOpen(true)}
          onOpenCopilot={() => handleNavigate('copilot')}
          view={currentView}
          user={user}
          onLogout={handleLogout}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-zinc-950">
          {renderActiveView()}
        </main>
      </div>

      <CommandPalette
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onOpenProcess={handleOpenProcess}
        onNavigate={handleNavigate}
      />
    </div>
  )
}
