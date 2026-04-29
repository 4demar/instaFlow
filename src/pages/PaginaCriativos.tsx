import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import { gerarImagem, obterFormatos } from '../services/imagemService'
import BotaoAcao from '../components/BotaoAcao'
import CampoTexto from '../components/CampoTexto'
import MensagemErro from '../components/MensagemErro'
import CarregandoSpinner from '../components/CarregandoSpinner'
import type { FormatoCriativo } from '../types/criativo'

export default function PaginaCriativos() {
  const { id } = useParams<{ id: string }>()
  const navegar = useNavigate()
  const { posts, atualizar } = usePosts()
  const post = posts.find((p) => p.id === id)

  const [prompt, setPrompt] = useState('')
  const [formato, setFormato] = useState<FormatoCriativo>('1080x1080')
  const [urlImagem, setUrlImagem] = useState<string | null>(post?.urlImagem || null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [textoOverlay, setTextoOverlay] = useState('')
  const [ctaTexto, setCtaTexto] = useState('')

  const formatos = obterFormatos()

  async function aoGerarImagem() {
    if (!prompt.trim()) return
    setCarregando(true)
    setErro(null)
    const resultado = await gerarImagem(prompt, formato)
    if (resultado.sucesso && resultado.urlImagem) {
      setUrlImagem(resultado.urlImagem)
      if (id) await atualizar(id, { urlImagem: resultado.urlImagem })
    } else {
      setErro(resultado.erro || 'Erro ao gerar imagem.')
    }
    setCarregando(false)
  }

  if (!post) return <CarregandoSpinner mensagem="Carregando..." />

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => navegar(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-h)' }}>←</button>
        <h2 style={{ margin: 0 }}>🎨 Criativos</h2>
      </div>

      <div style={{ marginBottom: '16px', textAlign: 'left' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, color: 'var(--text-h)' }}>Formato</label>
        <select value={formato} onChange={(e) => setFormato(e.target.value as FormatoCriativo)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)', fontSize: '16px' }}>
          {formatos.map((f) => <option key={f.valor} value={f.valor}>{f.rotulo}</option>)}
        </select>
      </div>

      <CampoTexto rotulo="Prompt para imagem" value={prompt} onChange={(e) => setPrompt(e.target.value)} multilinha placeholder="Descreva a imagem que deseja gerar..." />

      <BotaoAcao onClick={aoGerarImagem} carregando={carregando} style={{ width: '100%', marginBottom: '16px' }}>
        ✨ Gerar Imagem com IA
      </BotaoAcao>

      {erro && <MensagemErro mensagem={erro} aoTentarNovamente={aoGerarImagem} />}
      {carregando && <CarregandoSpinner mensagem="Gerando imagem..." />}

      {urlImagem && (
        <div style={{ marginTop: '16px', position: 'relative' }}>
          <img src={urlImagem} alt="Criativo gerado" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border)' }} />
          {(textoOverlay || ctaTexto) && (
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', textAlign: 'center' }}>
              {textoOverlay && <p style={{ color: '#fff', fontSize: '18px', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', marginBottom: '8px' }}>{textoOverlay}</p>}
              {ctaTexto && <span style={{ background: 'var(--accent)', color: '#fff', padding: '8px 20px', borderRadius: '20px', fontWeight: 600, fontSize: '14px' }}>{ctaTexto}</span>}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '16px' }}>
        <CampoTexto rotulo="Texto sobre a imagem" value={textoOverlay} onChange={(e) => setTextoOverlay(e.target.value)} placeholder="Texto principal do criativo" />
        <CampoTexto rotulo="CTA (chamada para ação)" value={ctaTexto} onChange={(e) => setCtaTexto(e.target.value)} placeholder="Ex: Saiba mais, Compre agora" />
      </div>
    </div>
  )
}
