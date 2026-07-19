import express from 'express';

// Import all API routes statically to ensure Vercel bundles them correctly
import * as route_agents from '../src/app/api/agents/route';
import * as route_agents_run from '../src/app/api/agents/run/route';
import * as route_ai_peticao from '../src/app/api/ai-peticao/route';
import * as route_ai_revisao from '../src/app/api/ai-revisao/route';
import * as route_reports from '../src/app/api/reports/route';
import * as route_knowledge from '../src/app/api/knowledge/route';
import * as route_firm_standards from '../src/app/api/firm-standards/route';
import * as route_processes_id from '../src/app/api/processes/[id]/route';
import * as route_processes_id_movements from '../src/app/api/processes/[id]/movements/route';
import * as route_processes from '../src/app/api/processes/route';
import * as route_time from '../src/app/api/time/route';
import * as route_automations from '../src/app/api/automations/route';
import * as route_copilot from '../src/app/api/copilot/route';
import * as route_search from '../src/app/api/search/route';
import * as route_notifications from '../src/app/api/notifications/route';
import * as route_agenda from '../src/app/api/agenda/route';
import * as route_clients from '../src/app/api/clients/route';
import * as route_compliance from '../src/app/api/compliance/route';
import * as route_tasks from '../src/app/api/tasks/route';
import * as route_api from '../src/app/api/route';
import * as route_templates from '../src/app/api/templates/route';
import * as route_admin_seed from '../src/app/api/admin/seed/route';
import * as route_admin from '../src/app/api/admin/route';
import * as route_portal from '../src/app/api/portal/route';
import * as route_contracts from '../src/app/api/contracts/route';
import * as route_financial from '../src/app/api/financial/route';
import * as route_outcome_pricing from '../src/app/api/outcome-pricing/route';
import * as route_deadlines from '../src/app/api/deadlines/route';
import * as route_datajud_search from '../src/app/api/datajud/search/route';
import * as route_datajud_sync from '../src/app/api/datajud/sync/route';
import * as route_ai_jurisprudencia from '../src/app/api/ai-jurisprudencia/route';
import * as route_viacep from '../src/app/api/viacep/route';
import * as route_dashboard from '../src/app/api/dashboard/route';
import * as route_cron_datajud_sync from '../src/app/api/cron/datajud-sync/route';
import * as route_conflicts from '../src/app/api/conflicts/route';
import * as route_audit from '../src/app/api/audit/route';
import * as route_team from '../src/app/api/team/route';
import * as route_documents from '../src/app/api/documents/route';
import * as route_auth_login from '../src/app/api/auth/login/route';

const app = express();
app.use(express.json());

// Helper to convert Express Request to Web Standard Request (Request)
function toNextRequest(req: express.Request): Request {
  const protocol = req.protocol;
  const host = req.get('host') || 'localhost';
  const url = `${protocol}://${host}${req.originalUrl}`;
  
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach(v => headers.append(key, v));
      } else {
        headers.set(key, value);
      }
    }
  }

  const init: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    init.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  return new Request(url, init);
}

// Helper to send Web Response (NextResponse) back through Express Response
async function sendNextResponse(webRes: Response, res: express.Response) {
  res.status(webRes.status);
  webRes.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  
  const body = await webRes.text();
  res.send(body);
}

// Handler executor function
async function handleRoute(module: any, req: express.Request, res: express.Response, params = {}) {
  try {
    const method = req.method.toUpperCase();
    const handler = module[method];
    
    if (typeof handler !== 'function') {
      res.status(405).json({ error: `Method ${method} Not Allowed on this route` });
      return;
    }

    const nextReq = toNextRequest(req);
    const context = { params };
    const nextRes = await handler(nextReq, context);
    
    if (nextRes instanceof Response) {
      await sendNextResponse(nextRes, res);
    } else {
      res.status(200).json(nextRes);
    }
  } catch (error) {
    console.error(`Error in route handler execution for ${req.path}:`, error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
}

// Statically mapped static routes
const routes: Record<string, any> = {
  '/api/agents': route_agents,
  '/api/agents/run': route_agents_run,
  '/api/ai-peticao': route_ai_peticao,
  '/api/ai-revisao': route_ai_revisao,
  '/api/reports': route_reports,
  '/api/knowledge': route_knowledge,
  '/api/firm-standards': route_firm_standards,
  '/api/processes': route_processes,
  '/api/time': route_time,
  '/api/automations': route_automations,
  '/api/copilot': route_copilot,
  '/api/search': route_search,
  '/api/notifications': route_notifications,
  '/api/agenda': route_agenda,
  '/api/clients': route_clients,
  '/api/compliance': route_compliance,
  '/api/tasks': route_tasks,
  '/api': route_api,
  '/api/templates': route_templates,
  '/api/admin/seed': route_admin_seed,
  '/api/admin': route_admin,
  '/api/portal': route_portal,
  '/api/contracts': route_contracts,
  '/api/financial': route_financial,
  '/api/outcome-pricing': route_outcome_pricing,
  '/api/deadlines': route_deadlines,
  '/api/datajud/search': route_datajud_search,
  '/api/datajud/sync': route_datajud_sync,
  '/api/ai-jurisprudencia': route_ai_jurisprudencia,
  '/api/viacep': route_viacep,
  '/api/dashboard': route_dashboard,
  '/api/cron/datajud-sync': route_cron_datajud_sync,
  '/api/conflicts': route_conflicts,
  '/api/audit': route_audit,
  '/api/team': route_team,
  '/api/documents': route_documents,
  '/api/auth/login': route_auth_login,
};

// Map dynamic endpoints explicitly
app.all('/api/processes/:id/movements', async (req, res) => {
  await handleRoute(route_processes_id_movements, req, res, { id: req.params.id });
});

app.all('/api/processes/:id', async (req, res) => {
  await handleRoute(route_processes_id, req, res, { id: req.params.id });
});

// Map standard static endpoints
app.all(/\/api\/.*/, async (req, res, next) => {
  // Normalize path by stripping trailing slash
  const cleanPath = req.path.replace(/\/$/, '') || '/api';
  const targetRoute = routes[cleanPath];
  
  if (targetRoute) {
    await handleRoute(targetRoute, req, res);
  } else {
    res.status(404).json({ error: `Endpoint ${req.method} ${req.path} not found` });
  }
});

export default app;
