import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import { usePerfilMarketing } from '../hooks/usePerfilMarketing'
import { useGeracaoIA } from '../hooks/useGeracaoIA'
import { useSalvamentoAutomatico } from '../hooks/useSalvamentoAutomatico'
import CampoTexto from '../components/CampoTexto'
import BotaoAcao from '../components/BotaoAcao'
import SeletorTom from '../components/SeletorTom'
import IndicadorStatus from '../components/IndicadorStatus'
import IndicadorSalvamento from '../components/IndicadorSalvamento'
import ListaHashtags from '../components/ListaHashtags'
import MensagemErro from '../components/MensagemErro'
import CarregandoSpinner from '../components/CarregandoSpinner'
import type { Post, FormatoPost, StatusPost } from '../types/post'
import type { HashtagSugerida } from '../types/hashtag'
import type { TomComunicacao } from '../types/perfilMarketing'
import type { ConfiguracaoGeracaoIA } from '../services/iaService'

export default function PaginaPost() {
  const { id } = useParams<{ id: string }>()
  const navegar = useNavigate()
  const { posts, atualizar, excluir, alterarStatus } = usePosts()
  const { perfil } = usePerfilMarketing()
  const { gerarLegenda, gerarHashtags, gerarRoteiro, carregando: carregandoIA, erro: erroIA, limparErro } = useGeracaoIA()

  const [post, setPost] = useState<Post | null>(null)
  const [legenda, setLegenda] = useState('')
  const [ideia, setIdeia] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagsSugeridas, setHashtagsSugeridas] = useState<HashtagSugerida[]>([])
  const [formato, setFormato] = useState<FormatoPost>('post')
  const [gancho, setGancho] = useState('')
  const [desenvolvimento, setDesenvolvimento] = useState('')
  const [chamadaAcao, setChamadaAcao] = useState('')
  const [tomSelecionado, setTomSelecionado] = useState<TomComunicacao>(perfil?.tomComunicacao || 'descontrado')

  useEffect(() => {
    const encontrado = posts.find((p) => p.id === id)
    if (encontrado) {
      setPost(encontrado)
      setIdeia(encontrado.ideia)
      setLegenda(encontrado.legenda)
      setHashtags(encontrado.hashtags)
      setFormato(encontrado.formato)
    }
  }, [posts, id])

  const { salvando, salvoEm } = useSalvamentoAutomatico({
    dados: { legenda, hashtags, ideia, formato },
    aoSalvar: async (dados) => {
      if (!id) return
      await atualizar(id, dados)
    },
    habilitado: !!id && !!post,
  })

  function obterConfig(): ConfiguracaoGeracaoIA | null {
    if (!perfil) return null
    return { nicho: perfil.nicho, publicoAlvo: perfil.publicoAlvo, objetivo: perfil.objetivo, tomComunicacao: tomSelecionado }
  }

  async function aoGerarLegenda() {
    const config = obterConfig()
    if (!config) return
    const resultado = await gerarLegenda(config, ideia)
    if (resultado) setLegenda(resultado)
  }

  async function aoGerarHashtags() {
    const config = obterConfig()
    if (!config) return
    const resultado = await gerarHashtags(config, ideia || legenda)
    if (resultado) {
      setHashtagsSugeridas(resultado)
      setHashtags(resultado.filter((h) => h.relevancia === 'alta').map((h) => h.texto))
    }
  }

  async function aoGerarRoteiro() {
    const config = obterConfig()
    if (!config) return
    const resultado = await gerarRoteiro(config, ideia)
    if (resultado) {
      setGancho(resultado.gancho)
      setDesenvolvimento(resultado.desenvolvimento)
      setChamadaAcao(resultado.chamadaAcao)
    }
  }

  function aoAlternarHashtag(texto: string) {
    setHashtags((prev) => prev.includes(texto) ? prev.filter((h) => h !== texto) : [...prev, texto])
  }

  async function aoExcluir() {
    if (!id) return
    await excluir(id)
    navegar('/')
  }

  async function aoAgendar() {
    if (!id) return
    await alterarStatus(id, 'agendado' as StatusPost, new Date())
  }

  if (!post) return <CarregandoSpinner mensagem="Carregando post..." />

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px 100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navegar(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-h)' }}>←</button>
          <IndicadorStatus status={post.status} />
        </div>
        <IndicadorSalvamento salvando={salvando} salvoEm={salvoEm} />
      </div>

      <CampoTexto rotulo="Ideia" value={ideia} onChange={(e) => setIdeia(e.target.value)} placeholder="Sobre o que é este post?" />

      <div style={{ marginBottom: '16px', textAlign: 'left' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, color: 'var(--text-h)' }}>Formato</label>
        <select value={formato} onChange={(e) => setFormato(e.target.value as FormatoPost)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)', fontSize: '16px' }}>
          <option value="post">📷 Post</option>
          <option value="story">📱 Story</option>
          <option value="reel">🎬 Reel</option>
        </select>
      </div>

      <SeletorTom valor={tomSelecionado} aoMudar={setTomSelecionado} />

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ fontWeight: 500, color: 'var(--text-h)' }}>Legenda</label>
          <BotaoAcao variante="secundario" onClick={aoGerarLegenda} carregando={carregandoIA} style={{ fontSize: '12px', padding: '6px 12px' }}>✨ Gerar</BotaoAcao>
        </div>
        <textarea value={legenda} onChange={(e) => setLegenda(e.target.value)} rows={6} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)', fontSize: '15px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'var(--sans)' }} />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ fontWeight: 500, color: 'var(--text-h)' }}>Hashtags</label>
          <BotaoAcao variante="secundario" onClick={aoGerarHashtags} carregando={carregandoIA} style={{ fontSize: '12px', padding: '6px 12px' }}>✨ Sugerir</BotaoAcao>
        </div>
        {hashtagsSugeridas.length > 0 && <ListaHashtags hashtags={hashtagsSugeridas} selecionadas={hashtags} aoAlternar={aoAlternarHashtag} />}
        {hashtags.length > 0 && <p style={{ fontSize: '13px', color: 'var(--accent)', marginTop: '8px' }}>{hashtags.join(' ')}</p>}
      </div>

      {formato === 'reel' && (
        <div style={{ marginBottom: '16px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>🎬 Roteiro</h3>
            <BotaoAcao variante="secundario" onClick={aoGerarRoteiro} carregando={carregandoIA} style={{ fontSize: '12px', padding: '6px 12px' }}>✨ Gerar</BotaoAcao>
          </div>
          <CampoTexto rotulo="Gancho" value={gancho} onChange={(e) => setGancho(e.target.value)} multilinha placeholder="Abertura que prende a atenção" />
          <CampoTexto rotulo="Desenvolvimento" value={desenvolvimento} onChange={(e) => setDesenvolvimento(e.target.value)} multilinha placeholder="Conteúdo principal" />
          <CampoTexto rotulo="Chamada para ação" value={chamadaAcao} onChange={(e) => setChamadaAcao(e.target.value)} placeholder="CTA final" />
        </div>
      )}

      {erroIA && <MensagemErro mensagem={erroIA} aoTentarNovamente={limparErro} />}

      <div style={{ display: 'flex', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
        <BotaoAcao onClick={() => navegar(`/criativos/${id}`)} variante="secundario" style={{ flex: 1 }}>🎨 Criativos</BotaoAcao>
        <BotaoAcao onClick={aoAgendar} variante="secundario" style={{ flex: 1 }}>📅 Agendar</BotaoAcao>
        <BotaoAcao onClick={() => navegar(`/publicacao/${id}`)} style={{ flex: 1 }}>📤 Publicar</BotaoAcao>
      </div>
      <BotaoAcao variante="perigo" onClick={aoExcluir} style={{ width: '100%', marginTop: '12px' }}>Excluir Post</BotaoAcao>
    </div>
  )
}
