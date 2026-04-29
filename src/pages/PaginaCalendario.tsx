import { useNavigate } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import { useCalendario } from '../hooks/useCalendario'
import CalendarioMensal from '../components/CalendarioMensal'
import CarregandoSpinner from '../components/CarregandoSpinner'

export default function PaginaCalendario() {
  const { posts, carregando, criar } = usePosts()
  const { mesAtual, avancarMes, voltarMes, diasDoMes, postsPorDia } = useCalendario(posts)
  const navegar = useNavigate()

  async function aoClicarDia(_data: Date) {
    const id = await criar({
      ideia: '',
      legenda: '',
      hashtags: [],
      formato: 'post',
      urlImagem: null,
      dataAgendamento: null,
    })
    navegar(`/post/${id}`)
  }

  function aoClicarPost(postId: string) {
    navegar(`/post/${postId}`)
  }

  if (carregando) return <CarregandoSpinner mensagem="Carregando calendário..." />

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 20px 100px' }}>
      <h2 style={{ marginBottom: '20px' }}>📅 Calendário de Postagens</h2>
      <CalendarioMensal
        mesAtual={mesAtual}
        diasDoMes={diasDoMes}
        postsPorDia={postsPorDia}
        aoAvancar={avancarMes}
        aoVoltar={voltarMes}
        aoClicarDia={aoClicarDia}
        aoClicarPost={aoClicarPost}
      />
    </div>
  )
}
