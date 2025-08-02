import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'

import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* Wrap the App component with BrowserRouter to enable routing */}
      <QueryClientProvider client={queryClient}> {/* Provide the query client to the application */}
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
