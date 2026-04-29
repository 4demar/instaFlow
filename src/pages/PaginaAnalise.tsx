import { useEffect, useState } from 'react'
import { useMetricas } from '../hooks/useMetricas'
import { usePerfilMarketing } from '../hooks/usePerfilMarketing'
import { useGeracaoIA } from '../hooks/useGeracaoIA'
import BotaoAcao from '../components/BotaoAcao'
import MensagemErro from '../components/MensagemErro'
import CarregandoSpinner from '../components/CarregandoSpinner'
import type { SugestaoMelhoria } from '../types/ia'
import type { ConfiguracaoGeracaoIA } from '../services/iaService'

export default function PaginaAnalise() {
  const { metricas, resumo, carregarTodas, carregando: carregandoMetricas } = useMetricas()
  const { perfil } = usePerfilMarketing()
  const { analisarDesempenho, carregando: carregandoIA, erro: erroIA } = useGeracaoIA()
  const [sugestoes, setSugestoes] = useState<SugestaoMelhoria[]>([])

  useEffect(() => { carregarTodas() }, [carregarTodas])

  function obterConfig(): ConfiguracaoGeracaoIA | null {
    if (!perfil) return null
    return { nicho: perfil.nicho, publicoAlvo: perfil.publicoAlvo, objetivo: perfil.objetivo, tomComunicacao: perfil.tomComunicacao }
  }

  async function aoAnalisar() {
    const config = obterConfig()
    if (!config) return
    const resultado = await analisarDesempenho(config, metricas)
    if (resultado) setSugestoes(resultado)
  }

  if (carregandoMetricas) return <CarregandoSpinner mensagem="Carregando métricas..." />

  const metricasSuficientes = metricas.length >= 3

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px 100px' }}>
      <h2 style={{ marginBottom: '20px' }}>📈 Análise de Desempenho</h2>

      {!metricasSuficientes ? (
        <div style={{ textAlign: 'center', padding: '32px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '40px', marginBottom: '12px' }}>📊</p>
          <p style={{ color: 'var(--text-h)', fontWeight: 500, marginBottom: '8px' }}>Métricas insuficientes</p>
          <p style={{ color: 'var(--text)', fontSize: '14px' }}>
            Registre métricas em pelo menos 3 posts publicados para visualizar a análise de desempenho.
            Você tem {metricas.length} de 3 necessárias.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { rotulo: 'Média Curtidas', valor: resumo.mediaCurtidas.toFixed(0), icone: '❤️' },
              { rotulo: 'Média Comentários', valor: resumo.mediaComentarios.toFixed(0), icone: '💬' },
              { rotulo: 'Média Alcance', valor: resumo.mediaAlcance.toFixed(0), icone: '👁️' },
              { rotulo: 'Média Salvamentos', valor: resumo.mediaSalvamentos.toFixed(0), icone: '🔖' },
            ].map((item) => (
              <div key={item.rotulo} style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontSize: '24px' }}>{item.icone}</span>
                <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-h)', margin: '4px 0' }}>{item.valor}</p>
                <p style={{ fontSize: '12px', color: 'var(--text)' }}>{item.rotulo}</p>
              </div>
            ))}
          </div>

          <BotaoAcao onClick={aoAnalisar} carregando={carregandoIA} style={{ width: '100%', marginBottom: '16px' }}>
            ✨ Analisar com IA
          </BotaoAcao>

          {erroIA && <MensagemErro mensagem={erroIA} aoTentarNovamente={aoAnalisar} />}
          {carregandoIA && <CarregandoSpinner mensagem="Analisando..." />}

          {sugestoes.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3>Sugestões de Melhoria</h3>
              {sugestoes.map((s, i) => (
                <div key={i} style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '14px' }}>{s.categoria}</span>
                    <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '8px', background: s.prioridade === 'alta' ? 'rgba(239,68,68,0.1)' : s.prioridade === 'media' ? 'rgba(245,158,11,0.1)' : 'rgba(107,114,128,0.1)', color: s.prioridade === 'alta' ? '#ef4444' : s.prioridade === 'media' ? '#f59e0b' : '#6b7280' }}>
                      {s.prioridade}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text)', fontSize: '14px' }}>{s.descricao}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
