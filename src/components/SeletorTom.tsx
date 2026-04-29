import type { TomComunicacao } from '../types/perfilMarketing'

interface PropriedadesSeletorTom {
  valor: TomComunicacao
  aoMudar: (tom: TomComunicacao) => void
}

const opcoes: { valor: TomComunicacao; rotulo: string }[] = [
  { valor: 'formal', rotulo: '🎩 Formal' },
  { valor: 'vendas', rotulo: '💰 Vendas' },
  { valor: 'descontrado', rotulo: '😎 Descontraído' },
]

export default function SeletorTom({ valor, aoMudar }: PropriedadesSeletorTom) {
  return (
    <div style={{ marginBottom: '16px', textAlign: 'left' }}>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, color: 'var(--text-h)' }}>
        Tom de comunicação
      </label>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {opcoes.map((opcao) => (
          <button
            key={opcao.valor}
            type="button"
            onClick={() => aoMudar(opcao.valor)}
            style={{
              padding: '10px 18px',
              borderRadius: '20px',
              border: `2px solid ${valor === opcao.valor ? 'var(--accent)' : 'var(--border)'}`,
              background: valor === opcao.valor ? 'var(--accent-bg)' : 'transparent',
              color: valor === opcao.valor ? 'var(--accent)' : 'var(--text)',
              cursor: 'pointer',
              fontWeight: valor === opcao.valor ? 600 : 400,
              fontSize: '14px',
              minHeight: '44px',
              transition: 'all 0.2s',
            }}
            aria-pressed={valor === opcao.valor}
          >
            {opcao.rotulo}
          </button>
        ))}
      </div>
    </div>
  )
}
