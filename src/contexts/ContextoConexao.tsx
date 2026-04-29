import { createContext, useEffect, useState, type ReactNode } from 'react'

export interface ContextoConexaoTipo {
  online: boolean
}

export const ContextoConexao = createContext<ContextoConexaoTipo>({ online: true })

export function ProvedorConexao({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const aoFicarOnline = () => setOnline(true)
    const aoFicarOffline = () => setOnline(false)
    window.addEventListener('online', aoFicarOnline)
    window.addEventListener('offline', aoFicarOffline)
    return () => {
      window.removeEventListener('online', aoFicarOnline)
      window.removeEventListener('offline', aoFicarOffline)
    }
  }, [])

  return (
    <ContextoConexao.Provider value={{ online }}>
      {children}
    </ContextoConexao.Provider>
  )
}
