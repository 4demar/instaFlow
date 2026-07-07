export interface ContextoLoteFrames {
  deslocamento: number
  total: number
}

/**
 * Prompt: geração de roteiro de frames de vídeo a partir de imagens.
 */
export function instrucaoSistemaFramesVideo(): string {
  return `Você é um diretor de vídeo especialista em transformar sequências de imagens em roteiros de frames para vídeos curtos. Analise cada imagem na ordem fornecida e descreva-a como um frame de vídeo.`
}

export function mensagemUsuarioFramesVideo(
  nomesImagens: string[],
  contexto?: ContextoLoteFrames
): string {
  const inicio = contexto ? contexto.deslocamento + 1 : 1
  const fim = inicio + nomesImagens.length - 1
  const listaNomes = nomesImagens.map((nome, i) => `Frame ${inicio + i}: ${nome}`).join('\n')

  const cabecalhoLote = contexto
    ? `Este é um lote com os frames ${inicio} a ${fim} de uma sequência total de ${contexto.total} frames. Mantenha coerência visual e narrativa com os demais frames da sequência.\n\n`
    : ''

  return (
    `${cabecalhoLote}Receba as imagens na ordem apresentada e monte um roteiro de frames.\n\n` +
    `Ordem dos frames neste lote:\n${listaNomes}\n\n` +
    `Retorne APENAS um JSON válido com o seguinte formato, contendo somente os frames deste lote:\n` +
    `{\n` +
    `  "totalFrames": number,\n` +
    `  "frames": [\n` +
    `    {\n` +
    `      "ordem": number,\n` +
    `      "nomeArquivo": string,\n` +
    `      "descricao": string,\n` +
    `      "elementosPrincipais": string[],\n` +
    `      "cores": string[],\n` +
    `      "atmosfera": string,\n` +
    `      "duracaoSugeridaSegundos": number\n` +
    `    }\n` +
    `  ]\n` +
    `}\n\n` +
    `A ordem dos frames deve seguir exatamente a ordem das imagens enviadas neste lote. Não inclua explicações fora do JSON.`
  )
}
