import { useNavigate } from 'react-router-dom'
import { useAutenticacao } from '../hooks/useAutenticacao'
import { usePosts } from '../hooks/usePosts'
import { usePerfilMarketing } from '../hooks/usePerfilMarketing'
import BotaoAcao from '../components/BotaoAcao'
import CartaoPost from '../components/CartaoPost'
import CarregandoSpinner from '../components/CarregandoSpinner'

export default function PaginaPrincipal() {
  const { usuario, logout } = useAutenticacao()
  const { posts, carregando, filtrarPorStatus } = usePosts()
  const { perfil } = usePerfilMarketing()
  const navegar = useNavigate()

  const rascunhos = filtrarPorStatus('rascunho')
  const agendados = filtrarPorStatus('agendado')
  const publicados = filtrarPorStatus('publicado')

  if (carregando) return <CarregandoSpinner mensagem="Carregando dashboard..." />

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px 100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px' }}>📸 InstaFlow</h2>
          <p style={{ fontSize: '14px', color: 'var(--text)', margin: '4px 0 0' }}>
            Olá, {usuario?.displayName || usuario?.email?.split('@')[0] || 'usuário'}
          </p>
        </div>
        <BotaoAcao variante="secundario" onClick={logout} style={{ fontSize: '13px', padding: '8px 14px' }}>
          Sair
        </BotaoAcao>
      </div>

      {!perfil && (
        <div style={{ padding: '20px', borderRadius: '12px', border: '2px dashed var(--accent-border)', background: 'var(--accent-bg)', marginBottom: '24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--accent)', fontWeight: 500, marginBottom: '12px' }}>
            Configure seu perfil de marketing para começar
          </p>
          <BotaoAcao onClick={() => navegar('/perfil')}>Configurar Perfil</BotaoAcao>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { rotulo: 'Rascunhos', valor: rascunhos.length, cor: '#6b7280' },
          { rotulo: 'Agendados', valor: agendados.length, cor: '#3b82f6' },
          { rotulo: 'Publicados', valor: publicados.length, cor: '#22c55e' },
        ].map((item) => (
          <div key={item.rotulo} style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ fontSize: '28px', fontWeight: 700, color: item.cor, margin: 0 }}>{item.valor}</p>
            <p style={{ fontSize: '12px', color: 'var(--text)', margin: '4px 0 0' }}>{item.rotulo}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '24px' }}>
        {[
          { rotulo: '💡 Gerar Ideias', caminho: '/ideias' },
          { rotulo: '📅 Calendário', caminho: '/calendario' },
          { rotulo: '🚀 Modo Growth', caminho: '/modo-growth' },
          { rotulo: '📊 Métricas', caminho: '/metricas' },
          { rotulo: '📈 Análise', caminho: '/analise' },
          { rotulo: '👤 Perfil', caminho: '/perfil' },
        ].map((item) => (
          <button
            key={item.caminho}
            onClick={() => navegar(item.caminho)}
            style={{
              padding: '20px 16px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 500,
              color: 'var(--text-h)',
              transition: 'box-shadow 0.2s',
              minHeight: '44px',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}
          >
            {item.rotulo}
          </button>
        ))}
      </div>

      {posts.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '12px' }}>Últimos Posts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {posts.slice(0, 5).map((post) => (
              <CartaoPost key={post.id} post={post} aoClicar={(id) => navegar(`/post/${id}`)} />
            ))}
          </div>
        </div>
      )}

      {posts.length === 0 && perfil && (
        <div style={{ textAlign: 'center', padding: '32px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '32px', marginBottom: '8px' }}>✨</p>
          <p style={{ color: 'var(--text-h)', fontWeight: 500 }}>Nenhum post ainda</p>
          <p style={{ color: 'var(--text)', fontSize: '14px', marginBottom: '16px' }}>Comece gerando ideias ou criando seu primeiro post.</p>
          <BotaoAcao onClick={() => navegar('/ideias')}>Gerar Ideias</BotaoAcao>
        </div>
      )}
    </div>
  )
}
