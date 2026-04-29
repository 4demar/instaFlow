interface PropriedadesIndicadorSalvamento {
  salvando: boolean
  salvoEm: Date | null
}

export default function IndicadorSalvamento({ salvando, salvoEm }: PropriedadesIndicadorSalvamento) {
  if (salvando) {
    return (
      <span style={{ fontSize: '13px', color: 'var(--accent)' }}>
        💾 Salvando...
      </span>
    )
  }
  if (salvoEm) {
    return (
      <span style={{ fontSize: '13px', color: 'var(--text)' }}>
        ✓ Salvo às {salvoEm.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
      </span>
    )
  }
  return null
}
