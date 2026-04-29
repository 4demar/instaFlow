import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAutenticacao } from '../hooks/useAutenticacao'
import CarregandoSpinner from '../components/CarregandoSpinner'

interface PropriedadesRotaProtegida {
  children: ReactNode
}

export default function RotaProtegida({ children }: PropriedadesRotaProtegida) {
  const { usuario, carregando } = useAutenticacao()

  if (carregando) {
    return <CarregandoSpinner mensagem="Verificando autenticação..." />
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
