import type { HashtagSugerida } from '../types/hashtag'

interface PropriedadesListaHashtags {
  hashtags: HashtagSugerida[]
  selecionadas: string[]
  aoAlternar: (texto: string) => void
}

const CORES_RELEVANCIA: Record<string, string> = {
  alta: '#22c55e',
  media: '#f59e0b',
  baixa: '#6b7280',
}

export default function ListaHashtags({ hashtags, selecionadas, aoAlternar }: PropriedadesListaHashtags) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {hashtags.map((h) => {
        const selecionada = selecionadas.includes(h.texto)
        return (
          <button
            key={h.texto}
            type="button"
            onClick={() => aoAlternar(h.texto)}
            style={{
              padding: '6px 14px',
              borderRadius: '16px',
              border: `2px solid ${selecionada ? 'var(--accent)' : 'var(--border)'}`,
              background: selecionada ? 'var(--accent-bg)' : 'transparent',
              color: selecionada ? 'var(--accent)' : 'var(--text)',
              cursor: 'pointer',
              fontSize: '13px',
              minHeight: '36px',
              transition: 'all 0.2s',
            }}
            aria-pressed={selecionada}
          >
            {h.texto}
            <span style={{ marginLeft: '4px', fontSize: '10px', color: CORES_RELEVANCIA[h.relevancia] }}>
              ●
            </span>
          </button>
        )
      })}
    </div>
  )
}
