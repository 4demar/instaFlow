/**
 * Verifica se um valor de string é vazio ou contém apenas espaços.
 */
export function campoVazio(valor: string): boolean {
  return valor.trim().length === 0
}

/**
 * Valida campos obrigatórios de um objeto.
 * Retorna um mapa de campo → mensagem de erro para campos inválidos.
 */
export function validarCamposObrigatorios(
  campos: Record<string, string>,
  rotulos?: Record<string, string>
): Record<string, string> {
  const erros: Record<string, string> = {}
  for (const [chave, valor] of Object.entries(campos)) {
    if (campoVazio(valor)) {
      const rotulo = rotulos?.[chave] ?? chave
      erros[chave] = `${rotulo} é obrigatório.`
    }
  }
  return erros
}

/**
 * Valida se um valor é numérico e não negativo.
 */
export function validarValorNumerico(valor: string): string | null {
  if (campoVazio(valor)) return 'Valor é obrigatório.'
  const numero = Number(valor)
  if (isNaN(numero)) return 'Informe um valor numérico válido.'
  if (numero < 0) return 'O valor não pode ser negativo.'
  return null
}
