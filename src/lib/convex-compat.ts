import { useState, useEffect, useCallback } from 'react';

// Simple global event system to trigger refetches when mutations run
const queryListeners = new Set<() => void>();

export function notifyQueryChange() {
  queryListeners.forEach(listener => {
    try {
      listener();
    } catch (e) {
      console.error('Error triggering query refetch:', e);
    }
  });
}

// Convert camelCase to spinal-case / kebab-case
function kebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// Helper to resolve the correct API endpoint and method from Convex query/mutation names
function getApiDetails(name: string, args?: any) {
  if (typeof name !== 'string') {
    return { url: '', method: 'GET' };
  }

  const [modelRaw, action] = name.split(':');
  let model = kebabCase(modelRaw || '');
  
  if (model === 'users') {
    model = 'team';
  }

  // Custom manual mappings
  if (model === 'dashboard') {
    return { url: '/api/dashboard', method: 'GET' };
  }
  
  let url = `/api/${model}`;
  let method = 'GET';

  const actionLower = action?.toLowerCase() || '';

  if (
    actionLower.includes('create') ||
    actionLower.includes('add') ||
    actionLower.includes('insert') ||
    actionLower.includes('save') ||
    actionLower.includes('new')
  ) {
    method = 'POST';
  } else if (
    actionLower.includes('update') ||
    actionLower.includes('edit') ||
    actionLower.includes('patch') ||
    actionLower.includes('modify') ||
    actionLower.includes('set') ||
    actionLower.includes('complete') ||
    actionLower.includes('mark') ||
    actionLower.includes('change') ||
    actionLower.includes('toggle') ||
    actionLower.includes('paid')
  ) {
    method = 'PATCH';
    const id = args?.id || args?._id;
    if (id) {
      url += `?id=${id}`;
    } else if (actionLower.includes('all')) {
      url += `?all=true`;
    }
  } else if (
    actionLower.includes('delete') ||
    actionLower.includes('remove') ||
    actionLower.includes('destroy')
  ) {
    method = 'DELETE';
    const id = args?.id || args?._id;
    if (id) {
      url += `?id=${id}`;
    }
  }

  return { url, method };
}

export class ConvexReactClient {
  constructor(public url: string) {}
}

export function ConvexProvider({ children, client }: { children: React.ReactNode, client?: any }) {
  return children;
}

export function ConvexClientProvider({ children, client }: { children: React.ReactNode, client?: any }) {
  return children;
}

export function useQuery(queryName: any, args?: any): any {
  const [data, setData] = useState<any>(undefined);
  const nameStr = typeof queryName === 'string' ? queryName : String(queryName);

  const fetchData = useCallback(async () => {
    if (!nameStr || nameStr === '[object Object]') return;

    try {
      const [modelRaw, action] = nameStr.split(':');
      let model = kebabCase(modelRaw || '');
      
      if (model === 'users') {
        model = 'team';
      }

      let url = `/api/${model}`;
      if (model === 'dashboard') {
        url = '/api/dashboard';
      }

      // Add query parameters for GET requests
      if (args && typeof args === 'object') {
        const params = new URLSearchParams();
        Object.entries(args).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            params.append(key, String(val));
          }
        });
        const qStr = params.toString();
        if (qStr) {
          url += (url.includes('?') ? '&' : '?') + qStr;
        }
      }

      const res = await fetch(url);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      } else {
        console.error(`Failed to fetch query ${nameStr}: status ${res.status}`);
      }
    } catch (e) {
      console.error(`Error fetching query ${nameStr}:`, e);
    }
  }, [nameStr, JSON.stringify(args)]);

  useEffect(() => {
    fetchData();
    queryListeners.add(fetchData);
    return () => {
      queryListeners.delete(fetchData);
    };
  }, [fetchData]);

  return data;
}

export function useMutation(mutationName: any): any {
  const nameStr = typeof mutationName === 'string' ? mutationName : String(mutationName);

  return useCallback(async (args?: any) => {
    const { url, method } = getApiDetails(nameStr, args);
    if (!url) {
      throw new Error(`Invalid mutation endpoint for: ${nameStr}`);
    }

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: args ? JSON.stringify(args) : undefined,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `Mutation ${nameStr} failed with status ${res.status}`);
    }

    // Parse response if valid JSON, otherwise return true/ok
    let resultData;
    try {
      resultData = await res.json();
    } catch {
      resultData = { ok: true };
    }

    // Trigger reactive reload of all queries
    notifyQueryChange();

    return resultData;
  }, [nameStr]);
}

export function useAction(actionName: any): any {
  return useMutation(actionName);
}
