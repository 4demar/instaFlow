import { useCallback, useState } from 'react'
import * as iaService from '../services/iaService'
import type { ImagemAnexada, RoteiroFramesVideo } from '../types/frameVideo'

export function useFramesVideo() {
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [roteiro, setRoteiro] = useState<RoteiroFramesVideo | null>(null)

  const gerarRoteiroFrames = useCallback(async (imagens: ImagemAnexada[]) => {
    setCarregando(true)
    setErro(null)
    try {
      const payload = imagens.map((imagem) => ({
        nome: imagem.nome,
        tipoMime: imagem.tipoMime,
        dadosBase64: imagem.dadosBase64,
      }))
      const resposta = await iaService.gerarFramesVideo(payload)
      if (!resposta.sucesso || !resposta.dados) {
        setErro(resposta.erro ?? 'Não foi possível gerar o roteiro de frames.')
        setRoteiro(null)
        return null
      }
      setRoteiro(resposta.dados)
      return resposta.dados
    } catch {
      setErro('Erro ao se comunicar com a IA.')
      setRoteiro(null)
      return null
    } finally {
      setCarregando(false)
    }
  }, [])

  const limparErro = useCallback(() => setErro(null), [])
  const limparRoteiro = useCallback(() => setRoteiro(null), [])

  return {
    carregando,
    erro,
    roteiro,
    gerarRoteiroFrames,
    limparErro,
    limparRoteiro,
  }
}
