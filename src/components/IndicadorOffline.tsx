import { useConexao } from '../hooks/useConexao'

export default function IndicadorOffline() {
  const { online } = useConexao()
  if (online) return null
  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '8px 16px',
        background: '#f59e0b',
        color: '#000',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: 600,
        zIndex: 9999,
      }}
    >
      📡 Você está offline. Algumas funcionalidades estão indisponíveis.
    </div>
  )
}
