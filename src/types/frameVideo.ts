export interface ImagemAnexada {
  id: string
  nome: string
  tipoMime: string
  dadosBase64: string
  urlPreview: string
  tamanhoBytes: number
}

export interface FrameVideo {
  ordem: number
  nomeArquivo: string
  descricao: string
  elementosPrincipais: string[]
  cores: string[]
  atmosfera: string
  duracaoSugeridaSegundos: number
}

export interface RoteiroFramesVideo {
  totalFrames: number
  frames: FrameVideo[]
}
