import { createContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import {
  loginComEmail,
  loginComGoogle,
  registrar,
  sair,
} from '../services/autenticacaoService'
import { auth } from '../database/firebaseConfig'

export interface ContextoAutenticacaoTipo {
  usuario: User | null
  carregando: boolean
  erro: string | null
  login: (email: string, senha: string) => Promise<void>
  loginGoogle: () => Promise<void>
  registrarUsuario: (email: string, senha: string) => Promise<void>
  logout: () => Promise<void>
  limparErro: () => void
}

export const ContextoAutenticacao = createContext<ContextoAutenticacaoTipo | null>(null)

interface ProvedorAutenticacaoProps {
  children: ReactNode
}

export function ProvedorAutenticacao({ children }: ProvedorAutenticacaoProps) {
  const [usuario, setUsuario] = useState<User | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const cancelar = onAuthStateChanged(auth, (user) => {
      setUsuario(user)
      setCarregando(false)
    })
    return cancelar
  }, [])

  const limparErro = useCallback(() => setErro(null), [])

  const login = useCallback(async (email: string, senha: string) => {
    try {
      setErro(null)
      setCarregando(true)
      await loginComEmail(email, senha)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao fazer login.')
    } finally {
      setCarregando(false)
    }
  }, [])

  const loginGoogleHandler = useCallback(async () => {
    try {
      setErro(null)
      setCarregando(true)
      await loginComGoogle()
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao fazer login com Google.')
    } finally {
      setCarregando(false)
    }
  }, [])

  const registrarUsuario = useCallback(async (email: string, senha: string) => {
    try {
      setErro(null)
      setCarregando(true)
      await registrar(email, senha)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao registrar.')
    } finally {
      setCarregando(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setErro(null)
      await sair()
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao sair.')
    }
  }, [])

  return (
    <ContextoAutenticacao.Provider
      value={{
        usuario,
        carregando,
        erro,
        login,
        loginGoogle: loginGoogleHandler,
        registrarUsuario,
        logout,
        limparErro,
      }}
    >
      {children}
    </ContextoAutenticacao.Provider>
  )
}
