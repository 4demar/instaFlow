import type { StatusPost } from '../types/post'

const CORES_STATUS: Record<StatusPost, { bg: string; cor: string; rotulo: string }> = {
  rascunho: { bg: 'rgba(156, 163, 175, 0.2)', cor: '#6b7280', rotulo: 'Rascunho' },
  agendado: { bg: 'rgba(59, 130, 246, 0.15)', cor: '#3b82f6', rotulo: 'Agendado' },
  publicado: { bg: 'rgba(34, 197, 94, 0.15)', cor: '#22c55e', rotulo: 'Publicado' },
}

export default function IndicadorStatus({ status }: { status: StatusPost }) {
  const { bg, cor, rotulo } = CORES_STATUS[status]
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '12px',
        background: bg,
        color: cor,
        fontSize: '13px',
        fontWeight: 600,
      }}
    >
      {rotulo}
    </span>
  )
}
