import { useState, useEffect, type FormEvent } from 'react'
import { usePerfilMarketing } from '../hooks/usePerfilMarketing'
import CampoTexto from '../components/CampoTexto'
import BotaoAcao from '../components/BotaoAcao'
import SeletorTom from '../components/SeletorTom'
import MensagemErro from '../components/MensagemErro'
import CarregandoSpinner from '../components/CarregandoSpinner'
import { validarCamposObrigatorios } from '../utils/validacao'
import type { ObjetivoMarketing, TomComunicacao } from '../types/perfilMarketing'

export default function PaginaPerfil() {
  const { perfil, carregando, erro, salvar } = usePerfilMarketing()
  const [nicho, setNicho] = useState('')
  const [publicoAlvo, setPublicoAlvo] = useState('')
  const [objetivo, setObjetivo] = useState<ObjetivoMarketing>('engajamento')
  const [tomComunicacao, setTomComunicacao] = useState<TomComunicacao>('descontrado')
  const [errosValidacao, setErrosValidacao] = useState<Record<string, string>>({})
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    if (perfil) {
      setNicho(perfil.nicho)
      setPublicoAlvo(perfil.publicoAlvo)
      setObjetivo(perfil.objetivo)
      setTomComunicacao(perfil.tomComunicacao)
    }
  }, [perfil])

  async function aoSubmeter(e: FormEvent) {
    e.preventDefault()
    const erros = validarCamposObrigatorios(
      { nicho, publicoAlvo },
      { nicho: 'Nicho', publicoAlvo: 'Público-alvo' }
    )
    if (Object.keys(erros).length > 0) {
      setErrosValidacao(erros)
      return
    }
    setErrosValidacao({})
    setSalvando(true)
    setSucesso(false)
    try {
      await salvar({ nicho, publicoAlvo, objetivo, tomComunicacao })
      setSucesso(true)
      setTimeout(() => setSucesso(false), 3000)
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) return <CarregandoSpinner mensagem="Carregando perfil..." />

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '24px 20px 100px' }}>
      <h2 style={{ marginBottom: '24px' }}>Perfil de Marketing</h2>
      {erro && <MensagemErro mensagem={erro} />}
      {sucesso && (
        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', marginBottom: '16px', textAlign: 'center' }}>
          Perfil salvo com sucesso!
        </div>
      )}
      <form onSubmit={aoSubmeter}>
        <CampoTexto rotulo="Nicho" value={nicho} onChange={(e) => setNicho(e.target.value)} erro={errosValidacao.nicho} placeholder="Ex: Moda feminina, Fitness, Gastronomia" />
        <CampoTexto rotulo="Público-alvo" value={publicoAlvo} onChange={(e) => setPublicoAlvo(e.target.value)} erro={errosValidacao.publicoAlvo} placeholder="Ex: Mulheres 25-35 anos interessadas em moda" />
        <div style={{ marginBottom: '16px', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, color: 'var(--text-h)' }}>Objetivo</label>
          <select
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value as ObjetivoMarketing)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '2px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)', fontSize: '16px' }}
          >
            <option value="vendas">💰 Vendas</option>
            <option value="engajamento">❤️ Engajamento</option>
            <option value="leads">📋 Leads</option>
          </select>
        </div>
        <SeletorTom valor={tomComunicacao} aoMudar={setTomComunicacao} />
        <BotaoAcao type="submit" carregando={salvando} style={{ width: '100%', marginTop: '16px' }}>
          Salvar Perfil
        </BotaoAcao>
      </form>
    </div>
  )
}
