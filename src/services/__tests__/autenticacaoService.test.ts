import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  mapaErrosAutenticacao,
  obterMensagemErro,
  loginComEmail,
  loginComGoogle,
  registrar,
  sair,
} from '../autenticacaoService'

// Mock do Firebase Auth
vi.mock('firebase/auth', () => {
  const credencialMock = {
    user: { uid: 'uid-teste-123', email: 'teste@email.com' },
    providerId: 'password',
    operationType: 'signIn',
  }

  return {
    signInWithEmailAndPassword: vi.fn().mockResolvedValue(credencialMock),
    createUserWithEmailAndPassword: vi.fn().mockResolvedValue(credencialMock),
    signInWithPopup: vi.fn().mockResolvedValue(credencialMock),
    GoogleAuthProvider: vi.fn(),
    signOut: vi.fn().mockResolvedValue(undefined),
    getAuth: vi.fn(() => ({})),
  }
})

// Mock da configuração do Firebase
vi.mock('../../database/configuracaoFirebase', () => ({
  auth: {},
}))

// Importar funções mockadas para controle nos testes
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'

describe('autenticacaoService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('mapaErrosAutenticacao', () => {
    it('deve conter todos os 7 códigos de erro mapeados', () => {
      const codigosEsperados = [
        'auth/user-not-found',
        'auth/wrong-password',
        'auth/email-already-in-use',
        'auth/weak-password',
        'auth/invalid-email',
        'auth/too-many-requests',
        'auth/network-request-failed',
      ]

      expect(Object.keys(mapaErrosAutenticacao)).toHaveLength(7)
      for (const codigo of codigosEsperados) {
        expect(mapaErrosAutenticacao).toHaveProperty(codigo)
      }
    })

    it('deve ter mensagens em português para todos os códigos', () => {
      for (const mensagem of Object.values(mapaErrosAutenticacao)) {
        expect(typeof mensagem).toBe('string')
        expect(mensagem.length).toBeGreaterThan(0)
      }
    })
  })

  describe('obterMensagemErro', () => {
    it('deve retornar a mensagem mapeada para um código conhecido', () => {
      expect(obterMensagemErro('auth/user-not-found')).toBe(
        'Usuário não encontrado. Verifique o e-mail informado.'
      )
    })

    it('deve retornar a mensagem mapeada para auth/wrong-password', () => {
      expect(obterMensagemErro('auth/wrong-password')).toBe(
        'Senha incorreta. Tente novamente.'
      )
    })

    it('deve retornar a mensagem mapeada para auth/email-already-in-use', () => {
      expect(obterMensagemErro('auth/email-already-in-use')).toBe(
        'Este e-mail já está cadastrado.'
      )
    })

    it('deve retornar mensagem genérica para código desconhecido', () => {
      expect(obterMensagemErro('auth/codigo-inexistente')).toBe(
        'Ocorreu um erro inesperado. Tente novamente mais tarde.'
      )
    })

    it('deve retornar mensagem genérica para string vazia', () => {
      expect(obterMensagemErro('')).toBe(
        'Ocorreu um erro inesperado. Tente novamente mais tarde.'
      )
    })
  })

  describe('loginComEmail', () => {
    it('deve retornar credencial ao fazer login com sucesso', async () => {
      const resultado = await loginComEmail('teste@email.com', 'senha123')

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'teste@email.com',
        'senha123'
      )
      expect(resultado).toHaveProperty('user')
      expect(resultado.user.uid).toBe('uid-teste-123')
    })

    it('deve lançar erro com mensagem em português quando falha', async () => {
      vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce({
        code: 'auth/user-not-found',
      })

      await expect(loginComEmail('naoexiste@email.com', 'senha123')).rejects.toThrow(
        'Usuário não encontrado. Verifique o e-mail informado.'
      )
    })

    it('deve lançar erro genérico quando código de erro é desconhecido', async () => {
      vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce({
        code: 'auth/unknown-error',
      })

      await expect(loginComEmail('teste@email.com', 'senha123')).rejects.toThrow(
        'Ocorreu um erro inesperado. Tente novamente mais tarde.'
      )
    })
  })

  describe('loginComGoogle', () => {
    it('deve retornar credencial ao fazer login com Google com sucesso', async () => {
      const resultado = await loginComGoogle()

      expect(signInWithPopup).toHaveBeenCalled()
      expect(resultado).toHaveProperty('user')
      expect(resultado.user.uid).toBe('uid-teste-123')
    })

    it('deve lançar erro com mensagem em português quando falha', async () => {
      vi.mocked(signInWithPopup).mockRejectedValueOnce({
        code: 'auth/network-request-failed',
      })

      await expect(loginComGoogle()).rejects.toThrow(
        'Erro de conexão. Verifique sua internet.'
      )
    })
  })

  describe('registrar', () => {
    it('deve retornar credencial ao registrar com sucesso', async () => {
      const resultado = await registrar('novo@email.com', 'senha123')

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'novo@email.com',
        'senha123'
      )
      expect(resultado).toHaveProperty('user')
    })

    it('deve lançar erro quando e-mail já está em uso', async () => {
      vi.mocked(createUserWithEmailAndPassword).mockRejectedValueOnce({
        code: 'auth/email-already-in-use',
      })

      await expect(registrar('existente@email.com', 'senha123')).rejects.toThrow(
        'Este e-mail já está cadastrado.'
      )
    })

    it('deve lançar erro quando senha é fraca', async () => {
      vi.mocked(createUserWithEmailAndPassword).mockRejectedValueOnce({
        code: 'auth/weak-password',
      })

      await expect(registrar('novo@email.com', '123')).rejects.toThrow(
        'A senha deve ter pelo menos 6 caracteres.'
      )
    })
  })

  describe('sair', () => {
    it('deve encerrar sessão com sucesso', async () => {
      await sair()

      expect(signOut).toHaveBeenCalled()
    })

    it('deve lançar erro com mensagem em português quando falha', async () => {
      vi.mocked(signOut).mockRejectedValueOnce({
        code: 'auth/network-request-failed',
      })

      await expect(sair()).rejects.toThrow(
        'Erro de conexão. Verifique sua internet.'
      )
    })
  })
})
