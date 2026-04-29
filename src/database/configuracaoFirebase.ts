import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

/**
 * Configuração do Firebase utilizando variáveis de ambiente do Vite.
 * As chaves são lidas de import.meta.env para manter segurança (Requisito 19.1).
 */
const configuracaoFirebase = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

/**
 * Instância do Firebase App inicializada com as variáveis de ambiente.
 */
const app: FirebaseApp = initializeApp(configuracaoFirebase)

/**
 * Instância do Firebase Auth para autenticação de usuários (Requisito 19.2).
 */
export const auth: Auth = getAuth(app)

/**
 * Instância do Firestore para persistência de dados (Requisito 19.3).
 * Regras de segurança no Firestore restringem acesso aos dados do usuário autenticado.
 */
export const db: Firestore = getFirestore(app)

export default app
