import type { ReactNode } from 'react'
import BotaoAcao from './BotaoAcao'

interface PropriedadesModal {
  aberto: boolean
  titulo: string
  children: ReactNode
  aoConfirmar: () => void
  aoCancelar: () => void
  textoBotaoConfirmar?: string
  variante?: 'primario' | 'perigo'
}

export default function ModalConfirmacao({
  aberto,
  titulo,
  children,
  aoConfirmar,
  aoCancelar,
  textoBotaoConfirmar = 'Confirmar',
  variante = 'primario',
}: PropriedadesModal) {
  if (!aberto) return null
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={aoCancelar}
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: 'var(--shadow)',
        }}
      >
        <h3 style={{ margin: '0 0 12px', color: 'var(--text-h)' }}>{titulo}</h3>
        <div style={{ marginBottom: '20px', color: 'var(--text)' }}>{children}</div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <BotaoAcao variante="secundario" onClick={aoCancelar}>Cancelar</BotaoAcao>
          <BotaoAcao variante={variante} onClick={aoConfirmar}>{textoBotaoConfirmar}</BotaoAcao>
        </div>
      </div>
    </div>
  )
}
