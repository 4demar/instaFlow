import { useNavigate } from 'react-router-dom'
import { usePerfilMarketing } from '../hooks/usePerfilMarketing'
import { useModoGrowth } from '../hooks/useModoGrowth'
import BotaoAcao from '../components/BotaoAcao'
import MensagemErro from '../components/MensagemErro'
import CarregandoSpinner from '../components/CarregandoSpinner'
import type { ConfiguracaoGeracaoIA } from '../services/iaService'

const NOMES_DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export default function PaginaModoGrowth() {
  const { perfil } = usePerfilMarketing()
  const { plano, carregando, erro, gerar, aprovarPost, rejeitarPost, aprovarPlano } = useModoGrowth()
  const navegar = useNavigate()

  function obterConfig(): ConfiguracaoGeracaoIA | null {
    if (!perfil) return null
    return { nicho: perfil.nicho, publicoAlvo: perfil.publicoAlvo, objetivo: perfil.objetivo, tomComunicacao: perfil.tomComunicacao }
  }

  async function aoGerar() {
    const config = obterConfig()
    if (!config) return
    await gerar(config)
  }

  async function aoAprovarPlano() {
    await aprovarPlano()
    navegar('/calendario')
  }

  if (!perfil) {
    return (
      <div style={{ padding: '24px 20px 100px', textAlign: 'center' }}>
        <p>Configure seu perfil de marketing antes de usar o Modo Growth.</p>
        <BotaoAcao onClick={() => navegar('/perfil')} style={{ marginTop: '16px' }}>Configurar Perfil</BotaoAcao>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px 100px' }}>
      <h2 style={{ marginBottom: '8px' }}>🚀 Modo Growth</h2>
      <p style={{ color: 'var(--text)', marginBottom: '24px', fontSize: '14px' }}>
        Gere automaticamente um plano semanal completo com ideias, legendas, hashtags e horários.
      </p>

      <BotaoAcao onClick={aoGerar} carregando={carregando} style={{ width: '100%', marginBottom: '24px' }}>
        ✨ Gerar Plano Semanal
      </BotaoAcao>

      {erro && <MensagemErro mensagem={erro} aoTentarNovamente={aoGerar} />}
      {carregando && <CarregandoSpinner mensagem="Gerando plano semanal..." />}

      {plano.length > 0 && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {plano.map((postPlano) => (
              <div
                key={postPlano.diaSemana}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: `2px solid ${postPlano.aprovado ? 'var(--accent)' : 'var(--border)'}`,
                  background: postPlano.aprovado ? 'var(--accent-bg)' : 'var(--bg)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-h)' }}>
                    {NOMES_DIAS[postPlano.diaSemana]}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                    🕐 {postPlano.horarioSugerido}
                  </span>
                </div>
                <p style={{ color: 'var(--text-h)', fontSize: '15px', marginBottom: '6px' }}>{postPlano.ideia}</p>
                <p style={{ color: 'var(--text)', fontSize: '13px', marginBottom: '6px' }}>{postPlano.legenda.substring(0, 100)}...</p>
                <p style={{ color: 'var(--accent)', fontSize: '12px', marginBottom: '10px' }}>{postPlano.hashtags.slice(0, 5).join(' ')}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <BotaoAcao
                    onClick={() => aprovarPost(postPlano.diaSemana)}
                    variante={postPlano.aprovado ? 'primario' : 'secundario'}
                    style={{ fontSize: '12px', padding: '6px 14px' }}
                  >
                    {postPlano.aprovado ? '✅ Aprovado' : 'Aprovar'}
                  </BotaoAcao>
                  {postPlano.aprovado && (
                    <BotaoAcao
                      onClick={() => rejeitarPost(postPlano.diaSemana)}
                      variante="secundario"
                      style={{ fontSize: '12px', padding: '6px 14px' }}
                    >
                      Rejeitar
                    </BotaoAcao>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <BotaoAcao onClick={aoAprovarPlano} style={{ flex: 1 }} disabled={!plano.some((p) => p.aprovado)}>
              Criar Posts Aprovados ({plano.filter((p) => p.aprovado).length})
            </BotaoAcao>
          </div>
        </>
      )}
    </div>
  )
}
