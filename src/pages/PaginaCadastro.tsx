import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAutenticacao } from '../hooks/useAutenticacao'
import CampoTexto from '../components/CampoTexto'
import BotaoAcao from '../components/BotaoAcao'
import MensagemErro from '../components/MensagemErro'

export default function PaginaCadastro() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erroLocal, setErroLocal] = useState<string | null>(null)
  const { registrarUsuario, carregando, erro, limparErro } = useAutenticacao()
  const navegar = useNavigate()

  async function aoSubmeter(e: FormEvent) {
    e.preventDefault()
    setErroLocal(null)
    limparErro()
    if (senha !== confirmarSenha) {
      setErroLocal('As senhas não coincidem.')
      return
    }
    await registrarUsuario(email, senha)
    navegar('/')
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>📸 InstaFlow</h1>
      <p style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--text)' }}>
        Crie sua conta
      </p>

      {(erro || erroLocal) && <MensagemErro mensagem={erroLocal || erro || ''} />}

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
          autoComplete="new-password"
        />
        <CampoTexto
          rotulo="Confirmar senha"
          type="password"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
          autoComplete="new-password"
        />
        <BotaoAcao type="submit" carregando={carregando} style={{ width: '100%', marginBottom: '24px' }}>
          Cadastrar
        </BotaoAcao>
      </form>

      <p style={{ textAlign: 'center', fontSize: '14px' }}>
        Já tem conta?{' '}
        <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
          Entrar
        </Link>
      </p>
    </div>
  )
}
