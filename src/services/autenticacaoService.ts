import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type UserCredential,
} from 'firebase/auth'
import { auth } from '../database/firebaseConfig'

/**
 * Mapeamento de códigos de erro do Firebase Auth para mensagens descritivas em português.
 * Garante que o usuário nunca veja códigos técnicos diretamente (Requisito 1.3).
 */
export const mapaErrosAutenticacao: Record<string, string> = {
  'auth/user-not-found': 'Usuário não encontrado. Verifique o e-mail informado.',
  'auth/wrong-password': 'Senha incorreta. Tente novamente.',
  'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/invalid-email': 'E-mail inválido. Verifique o formato.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos.',
  'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
}

/**
 * Mensagem genérica exibida quando o código de erro não possui mapeamento específico.
 */
const MENSAGEM_ERRO_GENERICA = 'Ocorreu um erro inesperado. Tente novamente mais tarde.'

/**
 * Retorna a mensagem de erro em português correspondente ao código de erro do Firebase Auth.
 * Se o código não estiver mapeado, retorna uma mensagem genérica.
 *
 * @param codigoErro - Código de erro do Firebase Auth (ex: 'auth/user-not-found')
 * @returns Mensagem descritiva em português
 */
export function obterMensagemErro(codigoErro: string): string {
  return mapaErrosAutenticacao[codigoErro] ?? MENSAGEM_ERRO_GENERICA
}

/**
 * Extrai o código de erro do Firebase Auth a partir de um erro genérico.
 */
function extrairCodigoErro(erro: unknown): string {
  if (
    typeof erro === 'object' &&
    erro !== null &&
    'code' in erro &&
    typeof (erro as { code: unknown }).code === 'string'
  ) {
    return (erro as { code: string }).code
  }
  return ''
}

/**
 * Provedor de autenticação Google para login social.
 */
const provedorGoogle = new GoogleAuthProvider()

/**
 * Realiza login com e-mail e senha via Firebase Auth (Requisito 1.1, 1.2).
 *
 * @param email - E-mail do usuário
 * @param senha - Senha do usuário
 * @returns UserCredential em caso de sucesso
 * @throws Erro com mensagem em português em caso de falha
 */
export async function loginComEmail(email: string, senha: string): Promise<UserCredential> {
  try {
    const credencial = await signInWithEmailAndPassword(auth, email, senha)
    return credencial
  } catch (erro: unknown) {
    const codigo = extrairCodigoErro(erro)
    throw new Error(obterMensagemErro(codigo), { cause: erro })
  }
}

/**
 * Realiza login com conta Google via popup do Firebase Auth (Requisito 1.4).
 *
 * @returns UserCredential em caso de sucesso
 * @throws Erro com mensagem em português em caso de falha
 */
export async function loginComGoogle(): Promise<UserCredential> {
  try {
    const credencial = await signInWithPopup(auth, provedorGoogle)
    return credencial
  } catch (erro: unknown) {
    const codigo = extrairCodigoErro(erro)
    throw new Error(obterMensagemErro(codigo), { cause: erro })
  }
}

/**
 * Registra um novo usuário com e-mail e senha via Firebase Auth (Requisito 1.5).
 *
 * @param email - E-mail do novo usuário
 * @param senha - Senha do novo usuário
 * @returns UserCredential em caso de sucesso
 * @throws Erro com mensagem em português em caso de falha
 */
export async function registrar(email: string, senha: string): Promise<UserCredential> {
  try {
    const credencial = await createUserWithEmailAndPassword(auth, email, senha)
    return credencial
  } catch (erro: unknown) {
    const codigo = extrairCodigoErro(erro)
    throw new Error(obterMensagemErro(codigo), { cause: erro })
  }
}

/**
 * Encerra a sessão do usuário autenticado (Requisito 1.6).
 *
 * @throws Erro com mensagem em português em caso de falha
 */
export async function sair(): Promise<void> {
  try {
    await signOut(auth)
  } catch (erro: unknown) {
    const codigo = extrairCodigoErro(erro)
    throw new Error(obterMensagemErro(codigo), { cause: erro })
  }
}
