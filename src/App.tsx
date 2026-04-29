import { BrowserRouter } from 'react-router-dom'
import { ProvedorAutenticacao } from './contexts/ContextoAutenticacao'
import { ProvedorConexao } from './contexts/ContextoConexao'
import { ProvedorPerfil } from './contexts/ContextoPerfil'
import { ProvedorPosts } from './contexts/ContextoPosts'
import IndicadorOffline from './components/IndicadorOffline'
import MenuNavegacao from './components/MenuNavegacao'
import Rotas from './routes/Rotas'

function App() {
  return (
    <BrowserRouter>
      <ProvedorAutenticacao>
        <ProvedorConexao>
          <ProvedorPerfil>
            <ProvedorPosts>
              <IndicadorOffline />
              <Rotas />
              <MenuNavegacao />
            </ProvedorPosts>
          </ProvedorPerfil>
        </ProvedorConexao>
      </ProvedorAutenticacao>
    </BrowserRouter>
  )
}

export default App
