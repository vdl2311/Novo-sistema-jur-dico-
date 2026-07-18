import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card border border-destructive/20 rounded-lg p-6 shadow-sm text-center">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
            <h1 className="text-lg font-semibold mb-2">Erro de Aplicação</h1>
            <p className="text-sm text-muted-foreground mb-4">
              Ocorreu um erro inesperado ao carregar a interface.
            </p>
            {this.state.error?.message?.includes('Convex') || this.state.error?.message?.includes('WebSocket') || this.state.error?.message?.includes('URL') ? (
              <div className="bg-muted p-3 rounded text-left mb-4">
                <p className="text-xs font-semibold mb-1">🚨 Erro de Conexão Convex</p>
                <p className="text-xs text-muted-foreground">
                  Parece que a variável de ambiente <code className="bg-background px-1 rounded">VITE_CONVEX_URL</code> não está configurada no Vercel. 
                  Por favor, adicione-a nas configurações do projeto no painel do Vercel e faça um novo deploy.
                </p>
              </div>
            ) : null}
            <div className="bg-muted p-3 rounded overflow-auto max-h-32 text-left">
              <pre className="text-[10px] text-muted-foreground">
                {this.state.error?.toString()}
              </pre>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
