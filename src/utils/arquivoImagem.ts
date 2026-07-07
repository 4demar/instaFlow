import type { ImagemAnexada } from '../types/frameVideo'

const TIPOS_MIME_ACEITOS = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']

/**
 * Verifica se o arquivo é uma imagem suportada.
 */
export function ehImagemValida(arquivo: File): boolean {
  return TIPOS_MIME_ACEITOS.includes(arquivo.type)
}

/**
 * Lê um arquivo de imagem e retorna a representação em base64 (sem prefixo data:).
 */
export function lerArquivoComoBase64(arquivo: File): Promise<string> {
  return new Promise((resolver, rejeitar) => {
    const leitor = new FileReader()
    leitor.onload = () => {
      const resultado = String(leitor.result || '')
      const separador = resultado.indexOf(',')
      resolver(separador >= 0 ? resultado.slice(separador + 1) : resultado)
    }
    leitor.onerror = () => rejeitar(new Error('Falha ao ler o arquivo.'))
    leitor.readAsDataURL(arquivo)
  })
}

export interface ResultadoConversaoImagens {
  imagens: ImagemAnexada[]
  ignoradas: number
}

/**
 * Converte uma lista de arquivos em imagens anexadas prontas para uso na UI e no envio à IA.
 * Arquivos não suportados são descartados e contabilizados em `ignoradas`.
 */
export async function converterArquivosEmImagens(
  arquivos: File[]
): Promise<ResultadoConversaoImagens> {
  const imagensValidas = arquivos.filter(ehImagemValida)
  const ignoradas = arquivos.length - imagensValidas.length
  const promessas = imagensValidas.map(async (arquivo) => {
    const dadosBase64 = await lerArquivoComoBase64(arquivo)
    const imagem: ImagemAnexada = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      nome: arquivo.name,
      tipoMime: arquivo.type,
      dadosBase64,
      urlPreview: URL.createObjectURL(arquivo),
      tamanhoBytes: arquivo.size,
    }
    return imagem
  })
  const imagens = await Promise.all(promessas)
  return { imagens, ignoradas }
}

/**
 * Libera as URLs de pré-visualização criadas por `URL.createObjectURL`.
 */
export function liberarUrlsPreview(imagens: ImagemAnexada[]): void {
  imagens.forEach((img) => URL.revokeObjectURL(img.urlPreview))
}
