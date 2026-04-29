import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import BotaoAcao from '../components/BotaoAcao'
import IndicadorStatus from '../components/IndicadorStatus'
import CarregandoSpinner from '../components/CarregandoSpinner'

export default function PaginaPublicacao() {
  const { id } = useParams<{ id: string }>()
  const navegar = useNavigate()
  const { posts, alterarStatus } = usePosts()
  const post = posts.find((p) => p.id === id)
  const [copiado, setCopiado] = useState(false)

  async function aoCopiarLegenda() {
    if (!post) return
    const texto = `${post.legenda}\n\n${post.hashtags.join(' ')}`
    await navigator.clipboard.writeText(texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 3000)
  }

  function aoAbrirInstagram() {
    window.open('https://www.instagram.com', '_blank')
  }

  async function aoMarcarPublicado() {
    if (!id) return
    await alterarStatus(id, 'publicado')
    navegar('/')
  }

  if (!post) return <CarregandoSpinner mensagem="Carregando..." />

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '24px 20px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => navegar(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-h)' }}>←</button>
        <h2 style={{ margin: 0 }}>📤 Publicação</h2>
        <IndicadorStatus status={post.status} />
      </div>

      {post.urlImagem && (
        <img src={post.urlImagem} alt="Criativo do post" style={{ width: '100%', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--border)' }} />
      )}

      <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '16px', textAlign: 'left' }}>
        <p style={{ color: 'var(--text-h)', whiteSpace: 'pre-wrap', fontSize: '15px', lineHeight: '1.6' }}>
          {post.legenda}
        </p>
        {post.hashtags.length > 0 && (
          <p style={{ color: 'var(--accent)', marginTop: '12px', fontSize: '14px' }}>
            {post.hashtags.join(' ')}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <BotaoAcao onClick={aoCopiarLegenda} style={{ width: '100%' }}>
          {copiado ? '✅ Copiado!' : '📋 Copiar Legenda + Hashtags'}
        </BotaoAcao>
        <BotaoAcao variante="secundario" onClick={aoAbrirInstagram} style={{ width: '100%' }}>
          📸 Abrir Instagram
        </BotaoAcao>
        {post.status !== 'publicado' && (
          <BotaoAcao onClick={aoMarcarPublicado} style={{ width: '100%' }}>
            ✅ Marcar como Publicado
          </BotaoAcao>
        )}
      </div>

      <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text)', textAlign: 'center' }}>
        Copie a legenda, abra o Instagram e publique manualmente.
      </p>
    </div>
  )
}
