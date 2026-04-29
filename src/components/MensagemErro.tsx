import BotaoAcao from './BotaoAcao'

interface PropriedadesMensagemErro {
  mensagem: string
  aoTentarNovamente?: () => void
}

export default function MensagemErro({ mensagem, aoTentarNovamente }: PropriedadesMensagemErro) {
  return (
    <div
      role="alert"
      style={{
        padding: '16px',
        borderRadius: '8px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        textAlign: 'center',
      }}
    >
      <p style={{ color: '#ef4444', marginBottom: aoTentarNovamente ? '12px' : '0' }}>
        {mensagem}
      </p>
      {aoTentarNovamente && (
        <BotaoAcao variante="secundario" onClick={aoTentarNovamente}>
          Tentar novamente
        </BotaoAcao>
      )}
    </div>
  )
}
