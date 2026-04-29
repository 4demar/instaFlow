const PREFIXO_CHAVE = 'instaflow_offline_'

/**
 * Armazena dados localmente para uso offline.
 */
export function armazenarLocal<T>(chave: string, dados: T): void {
  try {
    localStorage.setItem(`${PREFIXO_CHAVE}${chave}`, JSON.stringify(dados))
  } catch {
    console.warn('Falha ao armazenar dados localmente.')
  }
}

/**
 * Obtém dados armazenados localmente.
 */
export function obterDadosLocais<T>(chave: string): T | null {
  try {
    const item = localStorage.getItem(`${PREFIXO_CHAVE}${chave}`)
    if (!item) return null
    return JSON.parse(item) as T
  } catch {
    return null
  }
}

/**
 * Remove dados locais após sincronização.
 */
export function removerDadosLocais(chave: string): void {
  localStorage.removeItem(`${PREFIXO_CHAVE}${chave}`)
}

/**
 * Lista todas as chaves de dados offline pendentes.
 */
export function listarChavesPendentes(): string[] {
  const chaves: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const chave = localStorage.key(i)
    if (chave?.startsWith(PREFIXO_CHAVE)) {
      chaves.push(chave.replace(PREFIXO_CHAVE, ''))
    }
  }
  return chaves
}
