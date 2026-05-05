import { BrowserRouter } from 'react-router-dom'
import { ProvedorAutenticacao } from './contexts/ContextoAutenticacao'
import { ProvedorConexao } from './contexts/ContextoConexao'
import { ProvedorPerfil } from './contexts/ContextoPerfil'
import { ProvedorPosts } from './contexts/ContextoPosts'
import IndicadorOffline from './components/IndicadorOffline'
import AppRoutes from './routes/AppRoutes'

function App() {

  return (
    <ProvedorAutenticacao>
      <ProvedorConexao>
        <ProvedorPerfil>
          <ProvedorPosts>
            <IndicadorOffline />
            <BrowserRouter >
              <AppRoutes />
            </BrowserRouter >
          </ProvedorPosts>
        </ProvedorPerfil>
      </ProvedorConexao>
    </ProvedorAutenticacao>
  )
}

export default App
