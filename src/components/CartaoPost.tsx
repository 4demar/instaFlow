import type { Post } from '../types/post'
import IndicadorStatus from './IndicadorStatus'

interface PropriedadesCartaoPost {
  post: Post
  aoClicar: (id: string) => void
}

export default function CartaoPost({ post, aoClicar }: PropriedadesCartaoPost) {
  return (
    <button
      onClick={() => aoClicar(post.id)}
      style={{
        display: 'block',
        width: '100%',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        background: 'var(--bg)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow)' }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <IndicadorStatus status={post.status} />
        <span style={{ fontSize: '12px', color: 'var(--text)' }}>
          {post.formato}
        </span>
      </div>
      <p style={{ fontWeight: 600, color: 'var(--text-h)', marginBottom: '4px', fontSize: '15px' }}>
        {post.ideia || 'Sem título'}
      </p>
      {post.legenda && (
        <p style={{ fontSize: '13px', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {post.legenda}
        </p>
      )}
      {post.hashtags.length > 0 && (
        <p style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '6px' }}>
          {post.hashtags.slice(0, 3).join(' ')}
          {post.hashtags.length > 3 && ` +${post.hashtags.length - 3}`}
        </p>
      )}
    </button>
  )
}
