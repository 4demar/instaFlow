interface PropriedadesCarregando {
  mensagem?: string
}

export default function CarregandoSpinner({ mensagem = 'Carregando...' }: PropriedadesCarregando) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px', gap: '12px' }}>
      <div
        style={{
          width: '36px',
          height: '36px',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'girar 0.8s linear infinite',
        }}
      />
      <p style={{ color: 'var(--text)', fontSize: '14px' }}>{mensagem}</p>
      <style>{`@keyframes girar { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
