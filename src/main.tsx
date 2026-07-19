import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './app/page'
import './app/globals.css'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/error-boundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Home />
      <Toaster />
    </ErrorBoundary>
  </React.StrictMode>
)
