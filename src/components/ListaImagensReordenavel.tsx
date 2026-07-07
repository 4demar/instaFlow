import { useState, type DragEvent } from 'react'
import type { ImagemAnexada } from '../types/frameVideo'

interface PropriedadesListaImagensReordenavel {
  imagens: ImagemAnexada[]
  aoReordenar: (novaLista: ImagemAnexada[]) => void
  aoRemover: (id: string) => void
}

export default function ListaImagensReordenavel({
  imagens,
  aoReordenar,
  aoRemover,
}: PropriedadesListaImagensReordenavel) {
  const [indiceArrastando, setIndiceArrastando] = useState<number | null>(null)
  const [indiceAlvo, setIndiceAlvo] = useState<number | null>(null)

  function aoIniciarArraste(indice: number, evento: DragEvent<HTMLLIElement>) {
    setIndiceArrastando(indice)
    evento.dataTransfer.effectAllowed = 'move'
  }

  function aoArrastarSobre(indice: number, evento: DragEvent<HTMLLIElement>) {
    evento.preventDefault()
    evento.dataTransfer.dropEffect = 'move'
    setIndiceAlvo(indice)
  }

  function aoSoltar(indiceDestino: number, evento: DragEvent<HTMLLIElement>) {
    evento.preventDefault()
    if (indiceArrastando === null || indiceArrastando === indiceDestino) {
      setIndiceArrastando(null)
      setIndiceAlvo(null)
      return
    }
    const novaLista = [...imagens]
    const [movido] = novaLista.splice(indiceArrastando, 1)
    novaLista.splice(indiceDestino, 0, movido)
    aoReordenar(novaLista)
    setIndiceArrastando(null)
    setIndiceAlvo(null)
  }

  function aoFinalizarArraste() {
    setIndiceArrastando(null)
    setIndiceAlvo(null)
  }

  if (imagens.length === 0) {
    return (
      <p style={{ color: 'var(--text-h)', fontSize: '14px', textAlign: 'center', padding: '16px' }}>
        Nenhuma imagem anexada ainda.
      </p>
    )
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {imagens.map((imagem, indice) => {
        const estaArrastando = indiceArrastando === indice
        const eAlvo = indiceAlvo === indice && indiceArrastando !== indice
        return (
          <li
            key={imagem.id}
            draggable
            onDragStart={(e) => aoIniciarArraste(indice, e)}
            onDragOver={(e) => aoArrastarSobre(indice, e)}
            onDrop={(e) => aoSoltar(indice, e)}
            onDragEnd={aoFinalizarArraste}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px',
              borderRadius: '10px',
              background: 'var(--bg)',
              border: `2px ${eAlvo ? 'dashed var(--accent)' : 'solid var(--border)'}`,
              opacity: estaArrastando ? 0.4 : 1,
              cursor: 'grab',
              transition: 'opacity 0.15s, border-color 0.15s',
            }}
          >
            <span
              style={{
                minWidth: '28px',
                height: '28px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: 'var(--accent)',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              {indice + 1}
            </span>
            <img
              src={imagem.urlPreview}
              alt={imagem.nome}
              style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={imagem.nome}
              >
                {imagem.nome}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-h)' }}>
                {(imagem.tamanhoBytes / 1024).toFixed(1)} KB
              </div>
            </div>
            <button
              onClick={() => aoRemover(imagem.id)}
              aria-label={`Remover ${imagem.nome}`}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px 8px',
              }}
            >
              ×
            </button>
          </li>
        )
      })}
    </ul>
  )
}
