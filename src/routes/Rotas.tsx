import { Routes, Route } from 'react-router-dom'
import RotaProtegida from './RotaProtegida'
import PaginaLogin from '../pages/PaginaLogin'
import PaginaCadastro from '../pages/PaginaCadastro'
import PaginaPrincipal from '../pages/PaginaPrincipal'
import PaginaPerfil from '../pages/PaginaPerfil'
import PaginaIdeias from '../pages/PaginaIdeias'
import PaginaPost from '../pages/PaginaPost'
import PaginaCriativos from '../pages/PaginaCriativos'
import PaginaCalendario from '../pages/PaginaCalendario'
import PaginaPublicacao from '../pages/PaginaPublicacao'
import PaginaMetricas from '../pages/PaginaMetricas'
import PaginaAnalise from '../pages/PaginaAnalise'
import PaginaModoGrowth from '../pages/PaginaModoGrowth'

export default function Rotas() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />
      <Route path="/cadastro" element={<PaginaCadastro />} />

      <Route path="/" element={<RotaProtegida><PaginaPrincipal /></RotaProtegida>} />
      <Route path="/perfil" element={<RotaProtegida><PaginaPerfil /></RotaProtegida>} />
      <Route path="/ideias" element={<RotaProtegida><PaginaIdeias /></RotaProtegida>} />
      <Route path="/post/:id" element={<RotaProtegida><PaginaPost /></RotaProtegida>} />
      <Route path="/criativos/:id" element={<RotaProtegida><PaginaCriativos /></RotaProtegida>} />
      <Route path="/calendario" element={<RotaProtegida><PaginaCalendario /></RotaProtegida>} />
      <Route path="/publicacao/:id" element={<RotaProtegida><PaginaPublicacao /></RotaProtegida>} />
      <Route path="/metricas" element={<RotaProtegida><PaginaMetricas /></RotaProtegida>} />
      <Route path="/analise" element={<RotaProtegida><PaginaAnalise /></RotaProtegida>} />
      <Route path="/modo-growth" element={<RotaProtegida><PaginaModoGrowth /></RotaProtegida>} />
    </Routes>
  )
}
