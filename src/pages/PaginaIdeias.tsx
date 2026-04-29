import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePerfilMarketing } from '../hooks/usePerfilMarketing'
import { useGeracaoIA } from '../hooks/useGeracaoIA'
import { usePosts } from '../hooks/usePosts'
import BotaoAcao from '../components/BotaoAcao'
import SeletorTom from '../components/SeletorTom'
import MensagemErro from '../components/MensagemErro'
import CarregandoSpinner from '../components/CarregandoSpinner'
import type { TomComunicacao } from '../types/perfilMarketing'
import type { ConfiguracaoGeracaoIA } from '../services/iaService'
import type { VariacaoConteudo } from '../types/ia'

export default function PaginaIdeias() {
  const { perfil } = usePerfilMarketing()
  const { gerarIdeias, gerarVariacoes, carregando, erro, limparErro } = useGeracaoIA()
  const { criar } = usePosts()
  const navegar = useNavigate()

  const [ideias, setIdeias] = useState<string[]>([])
  const [tomSelecionado, setTomSelecionado] = useState<TomComunicacao>(perfil?.tomComunicacao || 'descontrado')
  const [ideiaEditando, setIdeiaEditando] = useState<number | null>(null)
  const [textoEdicao, setTextoEdicao] = useState('')
  const [variacoes, setVariacoes] = useState<VariacaoConteudo[]>([])
  const [ideiaExpandida, setIdeiaExpandida] = useState<string | null>(null)

  function obterConfig(): ConfiguracaoGeracaoIA | null {
    if (!perfil) return null
    return {
      nicho: perfil.nicho,
      publicoAlvo: perfil.publicoAlvo,
      objetivo: perfil.objetivo,
      tomComunicacao: tomSelecionado,
    }
  }

  async function aoGerarIdeias() {
    const config = obterConfig()
    if (!config) return
    const resultado = await gerarIdeias(config)
    if (resultado) setIdeias(resultado)
  }

  function aoEditarIdeia(indice: number) {
    setIdeiaEditando(indice)
    setTextoEdicao(ideias[indice])
  }

  function aoSalvarEdicao() {
    if (ideiaEditando === null) return
    setIdeias((prev) => prev.map((ideia, i) => (i === ideiaEditando ? textoEdicao : ideia)))
    setIdeiaEditando(null)
  }

  async function aoExpandirIdeia(ideia: string) {
    const config = obterConfig()
    if (!config) return
    setIdeiaExpandida(ideia)
    const resultado = await gerarVariacoes(config, ideia)
    if (resultado) setVariacoes(resultado)
  }

  async function aoCriarPostDeIdeia(ideia: string) {
    const id = await criar({
      ideia,
      legenda: '',
      hashtags: [],
      formato: 'post',
      urlImagem: null,
      dataAgendamento: null,
    })
    navegar(`/post/${id}`)
  }

  async function aoCriarPostDeVariacao(variacao: VariacaoConteudo) {
    const id = await criar({
      ideia: ideiaExpandida || '',
      legenda: variacao.legenda,
      hashtags: variacao.hashtags,
      formato: variacao.formato,
      urlImagem: null,
      dataAgendamento: null,
    })
    navegar(`/post/${id}`)
  }

  if (!perfil) {
    return (
      <div style={{ padding: '24px 20px 100px', textAlign: 'center' }}>
        <p>Configure seu perfil de marketing antes de gerar ideias.</p>
        <BotaoAcao onClick={() => navegar('/perfil')} style={{ marginTop: '16px' }}>
          Configurar Perfil
        </BotaoAcao>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px 100px' }}>
      <h2 style={{ marginBottom: '16px' }}>💡 Gerador de Ideias</h2>

      <SeletorTom valor={tomSelecionado} aoMudar={setTomSelecionado} />

      <BotaoAcao onClick={aoGerarIdeias} carregando={carregando} style={{ width: '100%', marginBottom: '24px' }}>
        Gerar Ideias
      </BotaoAcao>

      {erro && <MensagemErro mensagem={erro} aoTentarNovamente={() => { limparErro(); aoGerarIdeias() }} />}
      {carregando && <CarregandoSpinner mensagem="Gerando ideias..." />}

      {ideias.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ideias.map((ideia, i) => (
            <div key={i} style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)' }}>
              {ideiaEditando === i ? (
                <div>
                  <textarea
                    value={textoEdicao}
                    onChange={(e) => setTextoEdicao(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)', fontSize: '14px', resize: 'vertical', minHeight: '60px', boxSizing: 'border-box' }}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <BotaoAcao onClick={aoSalvarEdicao}>Salvar</BotaoAcao>
                    <BotaoAcao variante="secundario" onClick={() => setIdeiaEditando(null)}>Cancelar</BotaoAcao>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ color: 'var(--text-h)', marginBottom: '10px', fontSize: '15px' }}>{ideia}</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <BotaoAcao onClick={() => aoCriarPostDeIdeia(ideia)} style={{ fontSize: '13px', padding: '8px 14px' }}>Criar Post</BotaoAcao>
                    <BotaoAcao variante="secundario" onClick={() => aoEditarIdeia(i)} style={{ fontSize: '13px', padding: '8px 14px' }}>Editar</BotaoAcao>
                    <BotaoAcao variante="secundario" onClick={() => aoExpandirIdeia(ideia)} style={{ fontSize: '13px', padding: '8px 14px' }}>Expandir</BotaoAcao>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {variacoes.length > 0 && ideiaExpandida && (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ marginBottom: '12px' }}>Variações de "{ideiaExpandida}"</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {variacoes.map((v, i) => (
              <div key={i} style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--accent-border)', background: 'var(--accent-bg)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase' }}>{v.formato}</span>
                <p style={{ color: 'var(--text-h)', margin: '8px 0', fontSize: '14px' }}>{v.legenda}</p>
                <p style={{ fontSize: '12px', color: 'var(--accent)' }}>{v.hashtags.join(' ')}</p>
                <BotaoAcao onClick={() => aoCriarPostDeVariacao(v)} style={{ marginTop: '8px', fontSize: '13px', padding: '8px 14px' }}>
                  Criar Post
                </BotaoAcao>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
