import type { Post } from '../types/post'
import IndicadorStatus from './IndicadorStatus'

interface PropriedadesCalendario {
  mesAtual: Date
  diasDoMes: { dias: Date[]; primeiroDiaSemana: number; totalDias: number }
  postsPorDia: Record<string, Post[]>
  aoAvancar: () => void
  aoVoltar: () => void
  aoClicarDia: (data: Date) => void
  aoClicarPost: (postId: string) => void
}

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function CalendarioMensal({
  mesAtual,
  diasDoMes,
  postsPorDia,
  aoAvancar,
  aoVoltar,
  aoClicarDia,
  aoClicarPost,
}: PropriedadesCalendario) {
  const nomesMes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={aoVoltar} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', minWidth: '44px', minHeight: '44px', color: 'var(--text-h)' }}>
          ◀
        </button>
        <h3 style={{ margin: 0, color: 'var(--text-h)' }}>
          {nomesMes[mesAtual.getMonth()]} {mesAtual.getFullYear()}
        </h3>
        <button onClick={aoAvancar} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', minWidth: '44px', minHeight: '44px', color: 'var(--text-h)' }}>
          ▶
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {DIAS_SEMANA.map((dia) => (
          <div key={dia} style={{ textAlign: 'center', fontWeight: 600, fontSize: '12px', padding: '8px 0', color: 'var(--text)' }}>
            {dia}
          </div>
        ))}

        {Array.from({ length: diasDoMes.primeiroDiaSemana }).map((_, i) => (
          <div key={`vazio-${i}`} />
        ))}

        {diasDoMes.dias.map((data) => {
          const dia = data.getDate().toString()
          const postsNoDia = postsPorDia[dia] || []
          return (
            <button
              key={dia}
              onClick={() => aoClicarDia(data)}
              style={{
                minHeight: '60px',
                padding: '4px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                background: 'var(--bg)',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ fontWeight: 500, color: 'var(--text-h)' }}>{dia}</span>
              {postsNoDia.slice(0, 2).map((post) => (
                <div
                  key={post.id}
                  onClick={(e) => { e.stopPropagation(); aoClicarPost(post.id) }}
                  style={{ fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  <IndicadorStatus status={post.status} />
                </div>
              ))}
              {postsNoDia.length > 2 && (
                <span style={{ fontSize: '10px', color: 'var(--accent)' }}>+{postsNoDia.length - 2}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
