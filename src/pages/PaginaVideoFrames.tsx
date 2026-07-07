import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import BotaoAcao from '../components/BotaoAcao'
import CarregandoSpinner from '../components/CarregandoSpinner'
import MensagemErro from '../components/MensagemErro'
import ListaImagensReordenavel from '../components/ListaImagensReordenavel'
import SeletorProvedorIA from '../components/SeletorProvedorIA'
import { useFramesVideo } from '../hooks/useFramesVideo'
import { useProvedorIA } from '../hooks/useProvedorIA'
import { converterArquivosEmImagens, liberarUrlsPreview } from '../utils/arquivoImagem'
import { MAX_IMAGENS_FRAMES } from '../utils/configFramesVideo'
import type { ImagemAnexada } from '../types/frameVideo'

export default function PaginaVideoFrames() {
  const { carregando, erro, roteiro, gerarRoteiroFrames, limparErro, limparRoteiro } = useFramesVideo()
  const {
    provedor,
    definirProvedor,
    chaveApi,
    definirChaveApi,
    definicao,
    configurado,
    provedoresDisponiveis,
  } = useProvedorIA()
  const [imagens, setImagens] = useState<ImagemAnexada[]>([])
  const [arrastandoArquivo, setArrastandoArquivo] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  const inputArquivoRef = useRef<HTMLInputElement | null>(null)
  const imagensRef = useRef<ImagemAnexada[]>([])

  useEffect(() => {
    imagensRef.current = imagens
  }, [imagens])

  useEffect(() => {
    return () => {
      liberarUrlsPreview(imagensRef.current)
    }
  }, [])

  async function anexarArquivos(arquivos: FileList | null) {
    if (!arquivos || arquivos.length === 0) return
    const { imagens: novas, ignoradas } = await converterArquivosEmImagens(Array.from(arquivos))

    const espacoDisponivel = MAX_IMAGENS_FRAMES - imagens.length
    const excedentes = Math.max(novas.length - espacoDisponivel, 0)
    const aceitas = excedentes > 0 ? novas.slice(0, espacoDisponivel) : novas

    if (excedentes > 0) {
      novas.slice(espacoDisponivel).forEach((img) => URL.revokeObjectURL(img.urlPreview))
    }

    if (aceitas.length > 0) {
      setImagens((atuais) => [...atuais, ...aceitas])
      limparRoteiro()
    }

    const partesAviso: string[] = []
    if (excedentes > 0) {
      partesAviso.push(
        `Limite de ${MAX_IMAGENS_FRAMES} imagens atingido. ${excedentes} imagem(ns) não foram adicionadas.`
      )
    }
    if (ignoradas > 0) {
      partesAviso.push(`${ignoradas} arquivo(s) ignorado(s) por formato não suportado.`)
    }
    setAviso(partesAviso.length > 0 ? partesAviso.join(' ') : null)
  }

  function aoSelecionarArquivos(evento: ChangeEvent<HTMLInputElement>) {
    anexarArquivos(evento.target.files)
    evento.target.value = ''
  }

  function aoArrastarSobreArea(evento: DragEvent<HTMLDivElement>) {
    evento.preventDefault()
    setArrastandoArquivo(true)
  }

  function aoSairDaArea() {
    setArrastandoArquivo(false)
  }

  function aoSoltarArquivos(evento: DragEvent<HTMLDivElement>) {
    evento.preventDefault()
    setArrastandoArquivo(false)
    anexarArquivos(evento.dataTransfer.files)
  }

  function aoReordenar(novaLista: ImagemAnexada[]) {
    setImagens(novaLista)
  }

  function aoRemover(id: string) {
    setImagens((atuais) => {
      const removida = atuais.find((img) => img.id === id)
      if (removida) URL.revokeObjectURL(removida.urlPreview)
      return atuais.filter((img) => img.id !== id)
    })
  }

  function aoLimparTudo() {
    liberarUrlsPreview(imagens)
    setImagens([])
    limparRoteiro()
    limparErro()
    setAviso(null)
  }

  async function aoGerarJson() {
    if (imagens.length === 0) return
    if (!configurado) return
    await gerarRoteiroFrames(imagens, {
      provedor,
      chaveApi: definicao.requerChaveApi ? chaveApi : undefined,
    })
  }

  async function aoCopiarJson() {
    if (!roteiro) return
    try {
      await navigator.clipboard.writeText(JSON.stringify(roteiro, null, 2))
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px 100px' }}>
      <h2 style={{ marginBottom: '8px' }}>🎞️ Vídeo por Frames</h2>
      <p style={{ color: 'var(--text-h)', fontSize: '14px', marginBottom: '20px' }}>
        Anexe até {MAX_IMAGENS_FRAMES} imagens, ordene arrastando na lista e gere um JSON com a descrição de cada frame na ordem definida.
      </p>

      <SeletorProvedorIA
        provedor={provedor}
        aoMudarProvedor={definirProvedor}
        chaveApi={chaveApi}
        aoMudarChaveApi={definirChaveApi}
        definicao={definicao}
        provedoresDisponiveis={provedoresDisponiveis}
      />

      <div
        onDragOver={aoArrastarSobreArea}
        onDragLeave={aoSairDaArea}
        onDrop={aoSoltarArquivos}
        onClick={() => inputArquivoRef.current?.click()}
        role="button"
        tabIndex={0}
        style={{
          border: `2px dashed ${arrastandoArquivo ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: '12px',
          padding: '28px 16px',
          textAlign: 'center',
          cursor: 'pointer',
          background: arrastandoArquivo ? 'var(--accent-bg)' : 'var(--bg)',
          marginBottom: '12px',
          transition: 'background 0.15s, border-color 0.15s',
        }}
      >
        <p style={{ margin: 0, color: 'var(--text)', fontSize: '15px', fontWeight: 600 }}>
          Clique ou arraste imagens aqui
        </p>
        <p style={{ margin: '4px 0 0', color: 'var(--text-h)', fontSize: '13px' }}>
          Formatos aceitos: PNG, JPG, WEBP, GIF
        </p>
        <input
          ref={inputArquivoRef}
          type="file"
          accept="image/*"
          multiple
          onChange={aoSelecionarArquivos}
          style={{ display: 'none' }}
        />
      </div>

      {aviso && (
        <p style={{ color: '#eab308', fontSize: '13px', marginTop: 0, marginBottom: '12px' }}>
          {aviso}
        </p>
      )}

      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16px' }}>
            Imagens anexadas ({imagens.length}/{MAX_IMAGENS_FRAMES})
          </h3>
          {imagens.length > 0 && (
            <button
              onClick={aoLimparTudo}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--text-h)',
                cursor: 'pointer',
                fontSize: '13px',
                textDecoration: 'underline',
              }}
            >
              Limpar tudo
            </button>
          )}
        </div>
        <ListaImagensReordenavel imagens={imagens} aoReordenar={aoReordenar} aoRemover={aoRemover} />
      </div>

      <BotaoAcao
        onClick={aoGerarJson}
        carregando={carregando}
        disabled={imagens.length === 0 || !configurado}
        style={{ width: '100%', marginBottom: '20px' }}
      >
        Gerar JSON das Imagens
      </BotaoAcao>

      {!configurado && (
        <p style={{ color: '#eab308', fontSize: '13px', margin: '-8px 0 16px' }}>
          Informe a chave da API do provedor selecionado para continuar.
        </p>
      )}

      {erro && (
        <div style={{ marginBottom: '16px' }}>
          <MensagemErro
            mensagem={erro}
            aoTentarNovamente={() => {
              limparErro()
              aoGerarJson()
            }}
          />
        </div>
      )}

      {carregando && <CarregandoSpinner mensagem="Analisando imagens e montando frames..." />}

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16px' }}>Retorno JSON</h3>
          {roteiro && (
            <BotaoAcao
              variante="secundario"
              onClick={aoCopiarJson}
              style={{ fontSize: '13px', padding: '6px 12px', minHeight: '32px' }}
            >
              {copiado ? 'Copiado!' : 'Copiar JSON'}
            </BotaoAcao>
          )}
        </div>
        <textarea
          readOnly
          value={roteiro ? JSON.stringify(roteiro, null, 2) : ''}
          placeholder="O JSON com os frames aparecerá aqui após a geração."
          style={{
            width: '100%',
            minHeight: '260px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text-h)',
            fontSize: '13px',
            fontFamily: 'monospace',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  )
}
