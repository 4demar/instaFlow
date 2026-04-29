import type { ButtonHTMLAttributes } from 'react'

type VarianteBotao = 'primario' | 'secundario' | 'perigo'

interface PropriedadesBotaoAcao extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBotao
  carregando?: boolean
}

const estilosVariante: Record<VarianteBotao, React.CSSProperties> = {
  primario: {
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
  },
  secundario: {
    background: 'transparent',
    color: 'var(--accent)',
    border: '2px solid var(--accent)',
  },
  perigo: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
  },
}

export default function BotaoAcao({
  variante = 'primario',
  carregando = false,
  children,
  disabled,
  style,
  ...props
}: PropriedadesBotaoAcao) {
  return (
    <button
      disabled={disabled || carregando}
      style={{
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 600,
        cursor: disabled || carregando ? 'not-allowed' : 'pointer',
        opacity: disabled || carregando ? 0.6 : 1,
        minWidth: '44px',
        minHeight: '44px',
        transition: 'opacity 0.2s',
        ...estilosVariante[variante],
        ...style,
      }}
      {...props}
    >
      {carregando ? 'Carregando...' : children}
    </button>
  )
}
