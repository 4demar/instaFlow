import { useNavigate, useLocation } from 'react-router-dom'

interface ItemMenu {
  caminho: string
  rotulo: string
  icone: string
}

const itensMenu: ItemMenu[] = [
  { caminho: '/', rotulo: 'Início', icone: '🏠' },
  { caminho: '/ideias', rotulo: 'Ideias', icone: '💡' },
  { caminho: '/calendario', rotulo: 'Calendário', icone: '📅' },
  { caminho: '/modo-growth', rotulo: 'Growth', icone: '🚀' },
  { caminho: '/perfil', rotulo: 'Perfil', icone: '👤' },
]

export default function MenuNavegacao() {
  const navegar = useNavigate()
  const localizacao = useLocation()

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 0',
        zIndex: 100,
      }}
      aria-label="Navegação principal"
    >
      {itensMenu.map((item) => {
        const ativo = localizacao.pathname === item.caminho
        return (
          <button
            key={item.caminho}
            onClick={() => navegar(item.caminho)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 12px',
              minWidth: '44px',
              minHeight: '44px',
              color: ativo ? 'var(--accent)' : 'var(--text)',
              fontSize: '11px',
              fontWeight: ativo ? 700 : 400,
              transition: 'color 0.2s',
            }}
            aria-current={ativo ? 'page' : undefined}
          >
            <span style={{ fontSize: '20px' }}>{item.icone}</span>
            {item.rotulo}
          </button>
        )
      })}
    </nav>
  )
}
