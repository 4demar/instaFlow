import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAutenticacao } from '../hooks/useAutenticacao'
import CampoTexto from '../components/CampoTexto'
import BotaoAcao from '../components/BotaoAcao'
import MensagemErro from '../components/MensagemErro'

export default function PaginaLogin() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const { login, loginGoogle, carregando, erro, limparErro } = useAutenticacao()
  const navegar = useNavigate()

  async function aoSubmeter(e: FormEvent) {
    e.preventDefault()
    limparErro()
    await login(email, senha)
    navegar('/')
  }

  async function aoLoginGoogle() {
    limparErro()
    await loginGoogle()
    navegar('/')
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>📸 InstaFlow</h1>
      <p style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--text)' }}>
        Marketing para Instagram com IA
      </p>

      {erro && <MensagemErro mensagem={erro} />}

      <form onSubmit={aoSubmeter} style={{ marginTop: '16px' }}>
        <CampoTexto
          rotulo="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <CampoTexto
          rotulo="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          autoComplete="current-password"
        />
        <BotaoAcao type="submit" carregando={carregando} style={{ width: '100%', marginBottom: '12px' }}>
          Entrar
        </BotaoAcao>
      </form>

      <BotaoAcao variante="secundario" onClick={aoLoginGoogle} carregando={carregando} style={{ width: '100%', marginBottom: '24px' }}>
        Entrar com Google
      </BotaoAcao>

      <p style={{ textAlign: 'center', fontSize: '14px' }}>
        Não tem conta?{' '}
        <Link to="/cadastro" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
          Cadastre-se
        </Link>
      </p>
    </div>
  )
}
