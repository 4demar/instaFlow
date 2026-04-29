import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import { useMetricas } from '../hooks/useMetricas'
import CampoTexto from '../components/CampoTexto'
import BotaoAcao from '../components/BotaoAcao'
import CartaoPost from '../components/CartaoPost'
import { validarValorNumerico } from '../utils/validacao'

export default function PaginaMetricas() {
  const { posts } = usePosts()
  const { registrar, carregarPorPost, metricas } = useMetricas()
  const navegar = useNavigate()

  const postsPublicados = posts.filter((p) => p.status === 'publicado')
  const [postSelecionado, setPostSelecionado] = useState<string | null>(null)
  const [curtidas, setCurtidas] = useState('')
  const [comentarios, setComentarios] = useState('')
  const [alcance, setAlcance] = useState('')
  const [salvamentos, setSalvamentos] = useState('')
  const [erros, setErros] = useState<Record<string, string>>({})
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    if (postSelecionado) carregarPorPost(postSelecionado)
  }, [postSelecionado, carregarPorPost])

  useEffect(() => {
    if (metricas.length > 0) {
      const m = metricas[0]
      setCurtidas(m.curtidas.toString())
      setComentarios(m.comentarios.toString())
      setAlcance(m.alcance.toString())
      setSalvamentos(m.salvamentos.toString())
    } else {
      setCurtidas('')
      setComentarios('')
      setAlcance('')
      setSalvamentos('')
    }
  }, [metricas])

  async function aoSubmeter(e: FormEvent) {
    e.preventDefault()
    const novosErros: Record<string, string> = {}
    const erroCurtidas = validarValorNumerico(curtidas)
    const erroComentarios = validarValorNumerico(comentarios)
    const erroAlcance = validarValorNumerico(alcance)
    const erroSalvamentos = validarValorNumerico(salvamentos)
    if (erroCurtidas) novosErros.curtidas = erroCurtidas
    if (erroComentarios) novosErros.comentarios = erroComentarios
    if (erroAlcance) novosErros.alcance = erroAlcance
    if (erroSalvamentos) novosErros.salvamentos = erroSalvamentos
    if (Object.keys(novosErros).length > 0) { setErros(novosErros); return }
    setErros({})
    if (!postSelecionado) return
    await registrar({
      postId: postSelecionado,
      curtidas: Number(curtidas),
      comentarios: Number(comentarios),
      alcance: Number(alcance),
      salvamentos: Number(salvamentos),
    })
    setSucesso(true)
    setTimeout(() => setSucesso(false), 3000)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px 100px' }}>
      <h2 style={{ marginBottom: '20px' }}>📊 Métricas</h2>
      {postsPublicados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <p style={{ color: 'var(--text)', marginBottom: '16px' }}>Nenhum post publicado ainda. Publique posts para registrar métricas.</p>
          <BotaoAcao onClick={() => navegar('/')}>Ir para o início</BotaoAcao>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '16px', color: 'var(--text)' }}>Selecione um post publicado:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            {postsPublicados.map((p) => (
              <div key={p.id} style={{ border: postSelecionado === p.id ? '2px solid var(--accent)' : 'none', borderRadius: '14px' }}>
                <CartaoPost post={p} aoClicar={() => setPostSelecionado(p.id)} />
              </div>
            ))}
          </div>
          {postSelecionado && (
            <form onSubmit={aoSubmeter}>
              <CampoTexto rotulo="Curtidas" type="number" value={curtidas} onChange={(e) => setCurtidas(e.target.value)} erro={erros.curtidas} />
              <CampoTexto rotulo="Comentários" type="number" value={comentarios} onChange={(e) => setComentarios(e.target.value)} erro={erros.comentarios} />
              <CampoTexto rotulo="Alcance" type="number" value={alcance} onChange={(e) => setAlcance(e.target.value)} erro={erros.alcance} />
              <CampoTexto rotulo="Salvamentos" type="number" value={salvamentos} onChange={(e) => setSalvamentos(e.target.value)} erro={erros.salvamentos} />
              {sucesso && <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', marginBottom: '16px', textAlign: 'center' }}>Métricas salvas!</div>}
              <BotaoAcao type="submit" style={{ width: '100%' }}>Salvar Métricas</BotaoAcao>
            </form>
          )}
        </>
      )}
    </div>
  )
}
