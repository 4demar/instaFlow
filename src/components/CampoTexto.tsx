import type { InputHTMLAttributes } from 'react'

interface PropriedadesCampoTexto extends InputHTMLAttributes<HTMLInputElement> {
  rotulo: string
  erro?: string
  multilinha?: boolean
}

export default function CampoTexto({
  rotulo,
  erro,
  multilinha = false,
  id,
  style,
  ...props
}: PropriedadesCampoTexto) {
  const campoId = id || rotulo.toLowerCase().replace(/\s+/g, '-')

  const estiloBase: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: `2px solid ${erro ? '#ef4444' : 'var(--border)'}`,
    background: 'var(--bg)',
    color: 'var(--text-h)',
    fontSize: '16px',
    fontFamily: 'var(--sans)',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    ...style,
  }

  return (
    <div style={{ marginBottom: '16px', textAlign: 'left' }}>
      <label
        htmlFor={campoId}
        style={{ display: 'block', marginBottom: '6px', fontWeight: 500, color: 'var(--text-h)' }}
      >
        {rotulo}
      </label>
      {multilinha ? (
        <textarea
          id={campoId}
          rows={4}
          style={{ ...estiloBase, resize: 'vertical' }}
          aria-invalid={!!erro}
          aria-describedby={erro ? `${campoId}-erro` : undefined}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={campoId}
          style={estiloBase}
          aria-invalid={!!erro}
          aria-describedby={erro ? `${campoId}-erro` : undefined}
          {...props}
        />
      )}
      {erro && (
        <span id={`${campoId}-erro`} role="alert" style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px', display: 'block' }}>
          {erro}
        </span>
      )}
    </div>
  )
}
