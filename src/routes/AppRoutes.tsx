import { Routes, Route, Navigate } from 'react-router-dom'
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
import { useAutenticacao } from '../hooks/useAutenticacao'
import { Navigator, Screen, type DrawerIconProps } from "./DrawerNavigator";
import { FiCalendar, FiHome, FiTrendingUp, FiUser } from 'react-icons/fi'
import { BsFillLightbulbFill } from 'react-icons/bs'


export default function AppRoutes() {
  const { usuario } = useAutenticacao()

  if (!usuario || usuario === null) {
    return (
      <Routes>
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/cadastro" element={<PaginaCadastro />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/cadastro" element={<Navigate to="/" replace />} />
      <Route path="/*" element={
        <Navigator initialRouteName={'principal'}>
          <Screen
            name={'principal'}
            component={() => <RotaProtegida><PaginaPrincipal /></RotaProtegida>}
            options={{
              headerTitle: '',
              drawerLabel: 'Principal',
              drawerIcon: ({ color }: DrawerIconProps) => (
                <FiHome color={color} size={20} />
              )
            }}
          />

          <Screen
            name={'/perfil'}
            component={() => <RotaProtegida><PaginaPerfil /></RotaProtegida>}
            options={{
              headerTitle: 'Perfil',
              drawerLabel: 'Perfil',
              drawerIcon: ({ color }: DrawerIconProps) => (
                <FiUser color={color} size={20} />
              ),
            }}
          />
          <Screen
            name={'/ideias'}
            component={() => <RotaProtegida><PaginaIdeias /></RotaProtegida>}
            options={{
              headerTitle: 'Ideias',
              drawerLabel: 'Ideias',
              drawerIcon: ({ color }: DrawerIconProps) => (
                <BsFillLightbulbFill color={color} size={20} />
              ),
            }}
          />

          <Screen
            name={'/calendario'}
            component={() => <RotaProtegida><PaginaCalendario /></RotaProtegida>}
            options={{
              headerTitle: 'Calendario',
              drawerLabel: 'Calendario',
              drawerIcon: ({ color }: DrawerIconProps) => (
                <FiCalendar color={color} size={20} />
              ),
            }}
          />

          <Screen
            name={'/modo-growth'}
            component={() => <RotaProtegida><PaginaModoGrowth /></RotaProtegida>}
            options={{
              headerTitle: 'Modo Growth',
              drawerLabel: 'Modo Growth',
              drawerIcon: ({ color }: DrawerIconProps) => (
                <FiTrendingUp color={color} size={20} />
              ),
            }}
          />

          <Screen
            name={'/criativos'}
            component={() => <RotaProtegida><PaginaCriativos /></RotaProtegida>}
            options={{ drawerItemStyle: { display: 'none' } }}
          />
          <Screen
            name={'/publicacao'}
            component={() => <RotaProtegida><PaginaPublicacao /></RotaProtegida>}
            options={{ drawerItemStyle: { display: 'none' } }}
          />
          <Screen
            name={'/metricas'}
            component={() => <RotaProtegida><PaginaMetricas /></RotaProtegida>}
            options={{ drawerItemStyle: { display: 'none' } }}
          />
          <Screen
            name={'/analise'}
            component={() => <RotaProtegida><PaginaAnalise /></RotaProtegida>}
            options={{ drawerItemStyle: { display: 'none' } }}
          />
          <Screen
            name={'/posts'}
            component={() => <RotaProtegida><PaginaPost /></RotaProtegida>}
            options={{ drawerItemStyle: { display: 'none' } }}
          />
        </Navigator>
      } />
    </Routes>
  )
}