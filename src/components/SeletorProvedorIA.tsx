import type { DefinicaoProvedor, IdProvedorIA } from '../types/provedorIA'

interface PropriedadesSeletorProvedorIA {
  provedor: IdProvedorIA
  aoMudarProvedor: (id: IdProvedorIA) => void
  chaveApi: string
  aoMudarChaveApi: (valor: string) => void
  definicao: DefinicaoProvedor
  provedoresDisponiveis: DefinicaoProvedor[]
}

export default function SeletorProvedorIA({
  provedor,
  aoMudarProvedor,
  chaveApi,
  aoMudarChaveApi,
  definicao,
  provedoresDisponiveis,
}: PropriedadesSeletorProvedorIA) {
  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        background: 'var(--bg)',
        marginBottom: '20px',
      }}
    >
      <label
        htmlFor="seletor-provedor-ia"
        style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}
      >
        Provedor de IA
      </label>
      <select
        id="seletor-provedor-ia"
        value={provedor}
        onChange={(e) => aoMudarProvedor(e.target.value as IdProvedorIA)}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          background: 'var(--bg-input, var(--bg))',
          color: 'var(--text)',
          fontSize: '14px',
        }}
      >
        {provedoresDisponiveis.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nome}
          </option>
        ))}
      </select>

      <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--text-h)' }}>
        {definicao.descricao}
      </p>

      {definicao.requerChaveApi && (
        <div style={{ marginTop: '12px' }}>
          <label
            htmlFor="campo-chave-api"
            style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}
          >
            Chave da API
          </label>
          <input
            id="campo-chave-api"
            type="password"
            autoComplete="off"
            value={chaveApi}
            onChange={(e) => aoMudarChaveApi(e.target.value)}
            placeholder="Cole aqui sua chave"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--bg-input, var(--bg))',
              color: 'var(--text)',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
          {definicao.urlObterChave && (
            <a
              href={definicao.urlObterChave}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '6px',
                fontSize: '12px',
                color: 'var(--accent)',
              }}
            >
              Obter chave gratuita
            </a>
          )}
        </div>
      )}
    </div>
  )
}
