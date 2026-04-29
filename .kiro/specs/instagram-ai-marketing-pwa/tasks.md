# Plano de Implementação: InstaFlow — PWA de Marketing para Instagram com IA

## Visão Geral

Implementação incremental do InstaFlow utilizando React 19 + TypeScript + Vite, Firebase (Auth + Firestore) e API da OpenAI. Cada tarefa constrói sobre as anteriores, priorizando a infraestrutura base, depois funcionalidades core, e finalmente integrações e funcionalidades avançadas. Toda nomenclatura em português brasileiro conforme steering.

## Tarefas

- [x] 1. Configurar infraestrutura base do projeto
  - [x] 1.1 Instalar dependências e configurar Firebase, OpenAI, React Router, e ferramentas de teste
    - Instalar: `firebase`, `openai`, `react-router-dom`, `vitest`, `fast-check`, `@testing-library/react`, `@testing-library/jest-dom`, `msw`, `jsdom`
    - Configurar `vitest` no `vite.config.ts` e criar `vitest.setup.ts`
    - Criar arquivo `.env` com variáveis `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_OPENAI_API_KEY`
    - Adicionar `.env` ao `.gitignore`
    - _Requisitos: 19.1, 19.4_

  - [x] 1.2 Criar estrutura de pastas e arquivos de tipos base
    - Criar pastas: `src/components/`, `src/contexts/`, `src/hooks/`, `src/services/`, `src/types/`, `src/utils/`, `src/pages/`, `src/routes/`, `src/database/`
    - Criar todos os tipos TypeScript em `src/types/`: `usuario.ts`, `perfilMarketing.ts`, `post.ts`, `roteiro.ts`, `metrica.ts`, `criativo.ts`, `planoSemanal.ts`, `hashtag.ts`, `ia.ts`
    - Definir interfaces e enums conforme design: `Usuario`, `PerfilMarketing`, `Post`, `Roteiro`, `Metrica`, `Criativo`, `PlanoSemanal`, `PostPlano`, `HashtagSugerida`, `VariacaoConteudo`, `SugestaoMelhoria`, `HorarioSugerido`, `ObjetivoMarketing`, `TomComunicacao`, `StatusPost`, `FormatoPost`, `FormatoCriativo`, `RelevanciaHashtag`, `StatusPlano`
    - _Requisitos: 2.1, 10.1, 15.1_

  - [x] 1.3 Configurar Firebase (Auth + Firestore) em `src/database/`
    - Criar `src/database/configuracaoFirebase.ts` com inicialização do Firebase App, Auth e Firestore usando variáveis de ambiente
    - Exportar instâncias de `auth` e `db` (Firestore)
    - _Requisitos: 19.1, 19.2, 19.3_

  - [x] 1.4 Configurar rotas da aplicação com React Router
    - Criar `src/routes/Rotas.tsx` com todas as rotas: `/login`, `/cadastro`, `/`, `/perfil`, `/ideias`, `/post/:id`, `/criativos/:id`, `/calendario`, `/publicacao/:id`, `/metricas`, `/analise`, `/modo-growth`
    - Criar componente `RotaProtegida` que redireciona para `/login` se usuário não autenticado
    - Atualizar `src/App.tsx` para usar o roteador
    - _Requisitos: 1.7_

- [x] 2. Implementar autenticação de usuários
  - [x] 2.1 Criar `autenticacaoService` em `src/services/autenticacaoService.ts`
    - Implementar métodos: `loginComEmail`, `loginComGoogle`, `registrar`, `sair`
    - Implementar mapeamento de erros Firebase Auth para mensagens em português (`mapaErrosAutenticacao`)
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ]* 2.2 Escrever teste de propriedade para mapeamento de erros de autenticação
    - **Propriedade 2: Mapeamento de erros de autenticação**
    - **Valida: Requisitos 1.3**

  - [x] 2.3 Criar `ContextoAutenticacao` em `src/contexts/ContextoAutenticacao.tsx`
    - Gerenciar estado do usuário autenticado via `onAuthStateChanged`
    - Expor `usuario`, `carregando`, `erro`, `login`, `loginGoogle`, `registrar`, `sair`
    - _Requisitos: 1.1, 1.2, 1.4, 1.5, 1.6, 1.7_

  - [x] 2.4 Criar hook `useAutenticacao` em `src/hooks/useAutenticacao.ts`
    - Consumir `ContextoAutenticacao` e expor lógica de autenticação
    - _Requisitos: 1.1, 1.2, 1.4, 1.5, 1.6_

  - [x] 2.5 Criar páginas `PaginaLogin` e `PaginaCadastro`
    - `src/pages/PaginaLogin.tsx`: formulário de e-mail/senha + botão Google + link para cadastro
    - `src/pages/PaginaCadastro.tsx`: formulário de registro com e-mail/senha
    - Exibir mensagens de erro mapeadas em português
    - Componentes auxiliares: `CampoTexto`, `BotaoAcao`
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 2.6 Escrever teste de propriedade para proteção de rotas
    - **Propriedade 1: Proteção de rotas para usuários não autenticados**
    - **Valida: Requisitos 1.7**

- [x] 3. Checkpoint — Verificar autenticação
  - Garantir que todos os testes passam, perguntar ao usuário se há dúvidas.

- [x] 4. Implementar perfil de marketing e componentes base
  - [x] 4.1 Criar `perfilService` em `src/services/perfilService.ts`
    - Implementar métodos: `obterPerfil`, `salvarPerfil`, `atualizarPerfil`
    - Persistir no Firestore em `/usuarios/{uid}/perfil`
    - _Requisitos: 2.2, 2.3_

  - [x] 4.2 Criar `ContextoPerfil` em `src/contexts/ContextoPerfil.tsx`
    - Gerenciar estado do perfil de marketing do usuário
    - Carregar perfil ao autenticar, expor `perfil`, `carregando`, `salvarPerfil`, `atualizarPerfil`
    - _Requisitos: 2.1, 2.2, 2.3, 2.5_

  - [x] 4.3 Criar hook `usePerfilMarketing` em `src/hooks/usePerfilMarketing.ts`
    - Consumir `ContextoPerfil` e expor lógica de CRUD do perfil
    - _Requisitos: 2.1, 2.2, 2.3_

  - [x] 4.4 Criar `PaginaPerfil` com formulário de perfil de marketing
    - `src/pages/PaginaPerfil.tsx`: campos para nicho, público-alvo, objetivo (select), tom de comunicação (select)
    - Componente `SeletorTom` para seleção de tom de comunicação
    - Validação de campos obrigatórios com mensagens inline
    - _Requisitos: 2.1, 2.4_

  - [x] 4.5 Criar funções de validação em `src/utils/validacao.ts`
    - Implementar `validarCamposObrigatorios` que verifica strings vazias ou apenas espaços
    - Implementar `validarValorNumerico` para campos de métricas
    - _Requisitos: 2.4, 15.4_

  - [ ]* 4.6 Escrever teste de propriedade para validação de campos obrigatórios
    - **Propriedade 3: Validação de campos obrigatórios em formulários**
    - **Valida: Requisitos 2.4, 15.4**

- [x] 5. Implementar serviço de IA e geração de ideias
  - [x] 5.1 Criar `iaService` em `src/services/iaService.ts`
    - Implementar interface `ConfiguracaoGeracaoIA` e `RespostaIA<T>`
    - Implementar método `gerarIdeias` que envia prompt à OpenAI com contexto do perfil (nicho, público-alvo, objetivo, tom)
    - Implementar tratamento de erros (timeout, rate limit, erro de rede) retornando `RespostaIA` com mensagem descritiva
    - _Requisitos: 3.1, 3.4, 3.5_

  - [ ]* 5.2 Escrever teste de propriedade para contexto do perfil nas gerações de IA
    - **Propriedade 4: Contexto do perfil em todas as gerações de IA**
    - **Valida: Requisitos 2.5, 3.1, 4.1, 5.1, 13.5**

  - [ ]* 5.3 Escrever teste de propriedade para tratamento de erros da OpenAI
    - **Propriedade 5: Tratamento de erros em chamadas à API da OpenAI**
    - **Valida: Requisitos 3.4, 4.5, 6.4, 7.4, 14.4**

  - [x] 5.4 Criar hook `useGeracaoIA` em `src/hooks/useGeracaoIA.ts`
    - Orquestrar chamadas ao `iaService`, gerenciar estados de carregamento e erro
    - Expor `gerarIdeias`, `carregando`, `erro`, `tentarNovamente`
    - _Requisitos: 3.1, 3.4_

  - [x] 5.5 Criar `PaginaIdeias` para geração e listagem de ideias
    - `src/pages/PaginaIdeias.tsx`: botão gerar ideias, seletor de tom, lista de ideias selecionáveis e editáveis
    - Componente `MensagemErro` com botão de retry
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 6. Implementar criação e edição de posts (legendas, hashtags, roteiros)
  - [x] 6.1 Completar `iaService` com métodos de geração de conteúdo
    - Implementar: `gerarLegenda`, `gerarHashtags`, `gerarRoteiro`, `gerarVariacoes`
    - Todos os métodos devem incluir contexto do perfil no prompt
    - _Requisitos: 4.1, 4.3, 4.4, 5.1, 5.4, 6.1_

  - [ ]* 6.2 Escrever teste de propriedade para estrutura do roteiro gerado
    - **Propriedade 22: Estrutura do roteiro gerado**
    - **Valida: Requisitos 6.1**

  - [ ]* 6.3 Escrever teste de propriedade para hashtags categorizadas por relevância
    - **Propriedade 23: Hashtags categorizadas por relevância**
    - **Valida: Requisitos 5.4**

  - [x] 6.4 Criar `postService` em `src/services/postService.ts`
    - Implementar: `criarPost`, `atualizarPost`, `listarPosts`, `excluirPost`, `alterarStatus`, `filtrarPostsPorStatus`
    - Novo post sempre inicia com status `rascunho`
    - Persistir no Firestore em `/usuarios/{uid}/posts/{postId}`
    - _Requisitos: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 6.5 Escrever teste de propriedade para máquina de estados do Post
    - **Propriedade 7: Máquina de estados do Post**
    - **Valida: Requisitos 10.1, 10.2, 10.3, 11.5**

  - [ ]* 6.6 Escrever teste de propriedade para filtragem de posts por status
    - **Propriedade 8: Filtragem de posts por status**
    - **Valida: Requisitos 10.4**

  - [x] 6.7 Criar `ContextoPosts` em `src/contexts/ContextoPosts.tsx`
    - Gerenciar lista de posts, CRUD, filtros por status
    - _Requisitos: 10.1, 10.4_

  - [x] 6.8 Criar hook `usePosts` em `src/hooks/usePosts.ts`
    - Consumir `ContextoPosts`, expor CRUD e filtros
    - _Requisitos: 10.1, 10.4_

  - [x] 6.9 Criar `PaginaPost` para criação e edição de post
    - `src/pages/PaginaPost.tsx`: editor de legenda (`EditorLegenda`), lista de hashtags (`ListaHashtags`), editor de roteiro (`EditorRoteiro`), seletor de formato, pré-visualização (`PreVisualizacaoPost`), indicador de status (`IndicadorStatus`)
    - Integrar geração de legenda, hashtags e roteiro via `useGeracaoIA`
    - _Requisitos: 3.3, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 6.1, 6.2, 6.3_

- [x] 7. Checkpoint — Verificar fluxo de criação de posts
  - Garantir que todos os testes passam, perguntar ao usuário se há dúvidas.

- [x] 8. Implementar geração de criativos e templates
  - [x] 8.1 Criar `imagemService` em `src/services/imagemService.ts`
    - Implementar: `gerarImagem` (chamada à API DALL-E da OpenAI), `obterFormatos`
    - Suportar formatos: 1080x1080 (post), 1080x1920 (story/reel)
    - Tratamento de erros com retry
    - _Requisitos: 7.1, 7.3, 7.4_

  - [ ]* 8.2 Escrever teste de propriedade para formato do criativo
    - **Propriedade 19: Formato do criativo corresponde à seleção**
    - **Valida: Requisitos 7.3**

  - [x] 8.3 Criar `PaginaCriativos` com editor de templates
    - `src/pages/PaginaCriativos.tsx`: seleção de formato, geração de imagem IA, editor visual de template (`EditorTemplate`), pré-visualização em tempo real
    - Salvar criativo no Firestore vinculado ao post
    - _Requisitos: 7.1, 7.2, 7.3, 7.5, 8.1, 8.2, 8.3, 8.4_

- [x] 9. Implementar calendário de postagens
  - [x] 9.1 Criar hook `useCalendario` em `src/hooks/useCalendario.ts`
    - Lógica de navegação mensal, posicionamento de posts por data, drag-and-drop
    - _Requisitos: 9.1, 9.3_

  - [x] 9.2 Criar componente `CalendarioMensal` em `src/components/CalendarioMensal.tsx`
    - Visualização mensal com posts posicionados por data de agendamento
    - Indicadores visuais por status (rascunho, agendado, publicado)
    - Suporte a drag-and-drop para mover posts entre datas
    - Layout compacto para mobile
    - _Requisitos: 9.1, 9.3, 9.4, 20.4_

  - [ ]* 9.3 Escrever teste de propriedade para calendário exibe posts nas datas corretas
    - **Propriedade 20: Calendário exibe posts nas datas corretas com indicadores de status**
    - **Valida: Requisitos 9.1, 9.4**

  - [ ]* 9.4 Escrever teste de propriedade para drag-and-drop atualiza data
    - **Propriedade 21: Drag-and-drop no calendário atualiza data**
    - **Valida: Requisitos 9.3**

  - [x] 9.5 Criar `PaginaCalendario`
    - `src/pages/PaginaCalendario.tsx`: integrar `CalendarioMensal`, permitir criar post ao clicar em data, abrir detalhes ao clicar em post
    - _Requisitos: 9.1, 9.2, 9.4, 9.5_

- [x] 10. Implementar publicação assistida
  - [x] 10.1 Criar `PaginaPublicacao`
    - `src/pages/PaginaPublicacao.tsx`: pré-visualização completa do post (imagem, legenda, hashtags), botão "copiar legenda" (copia legenda + hashtags para clipboard), botão "abrir Instagram" (abre app/site), botão "marcar como publicado"
    - _Requisitos: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 10.2 Escrever teste de propriedade para conteúdo copiado para clipboard
    - **Propriedade 9: Conteúdo copiado para área de transferência**
    - **Valida: Requisitos 11.2**

- [x] 11. Implementar métricas e análise de desempenho
  - [x] 11.1 Criar `metricaService` em `src/services/metricaService.ts`
    - Implementar: `registrarMetrica`, `atualizarMetrica`, `obterMetricasPorPost`, `obterResumoMetricas`
    - Calcular médias de engajamento (curtidas, comentários, alcance, salvamentos)
    - _Requisitos: 15.2, 15.3, 16.1_

  - [ ]* 11.2 Escrever teste de propriedade para cálculo de médias de engajamento
    - **Propriedade 15: Cálculo de médias de engajamento**
    - **Valida: Requisitos 16.1**

  - [x] 11.3 Criar hook `useMetricas` em `src/hooks/useMetricas.ts`
    - Registro e consulta de métricas, cálculo de resumo
    - _Requisitos: 15.1, 15.2, 16.1_

  - [x] 11.4 Completar `iaService` com métodos de análise
    - Implementar: `analisarDesempenho`, `sugerirHorarios`
    - _Requisitos: 12.1, 12.2, 16.2_

  - [ ]* 11.5 Escrever teste de propriedade para sugestão de horários
    - **Propriedade 10: Sugestão de horários com e sem métricas**
    - **Valida: Requisitos 12.1, 12.2**

  - [x] 11.6 Criar `PaginaMetricas` para registro de métricas
    - `src/pages/PaginaMetricas.tsx`: formulário de métricas exibido apenas para posts publicados, validação de valores numéricos
    - _Requisitos: 15.1, 15.2, 15.3, 15.4_

  - [ ]* 11.7 Escrever teste de propriedade para exibição condicional do formulário de métricas
    - **Propriedade 24: Exibição do formulário de métricas apenas para posts publicados**
    - **Valida: Requisitos 15.1**

  - [ ]* 11.8 Escrever teste de propriedade para mensagem de métricas insuficientes
    - **Propriedade 25: Mensagem de métricas insuficientes**
    - **Valida: Requisitos 16.4**

  - [x] 11.9 Criar `PaginaAnalise` com painel de análise e sugestões
    - `src/pages/PaginaAnalise.tsx`: gráficos comparativos (`GraficoDesempenho`), sugestões de melhoria da IA, mensagem de orientação quando métricas insuficientes
    - _Requisitos: 16.1, 16.2, 16.3, 16.4_

- [x] 12. Checkpoint — Verificar métricas e análise
  - Garantir que todos os testes passam, perguntar ao usuário se há dúvidas.

- [x] 13. Implementar Modo Growth e expansão de ideias
  - [x] 13.1 Completar `iaService` com método `gerarPlanoSemanal`
    - Gerar plano com 7 entradas (uma por dia), cada uma com ideia, legenda, hashtags e horário sugerido
    - _Requisitos: 13.1, 13.5_

  - [ ]* 13.2 Escrever teste de propriedade para estrutura do Plano Semanal
    - **Propriedade 11: Estrutura completa do Plano Semanal**
    - **Valida: Requisitos 13.1**

  - [x] 13.3 Criar hook `useModoGrowth` em `src/hooks/useModoGrowth.ts`
    - Geração do plano, aprovação/rejeição de posts individuais, criação de posts agendados a partir do plano aprovado
    - _Requisitos: 13.1, 13.2, 13.3, 13.4_

  - [ ]* 13.4 Escrever teste de propriedade para aprovação do Plano Semanal cria posts
    - **Propriedade 12: Aprovação do Plano Semanal cria posts agendados**
    - **Valida: Requisitos 13.3**

  - [x] 13.5 Criar `PaginaModoGrowth`
    - `src/pages/PaginaModoGrowth.tsx`: botão gerar plano, lista de posts do plano com aprovação/rejeição individual, botão aprovar plano completo
    - _Requisitos: 13.1, 13.2, 13.3, 13.4_

  - [x] 13.6 Implementar expansão de ideias em múltiplos formatos
    - Integrar `gerarVariacoes` do `iaService` na `PaginaIdeias`
    - Permitir seleção de variações e criação de posts individuais
    - _Requisitos: 14.1, 14.2, 14.3_

  - [ ]* 13.7 Escrever teste de propriedade para variações multi-formato
    - **Propriedade 13: Expansão de ideia gera variações em múltiplos formatos**
    - **Valida: Requisitos 14.1, 14.2**

  - [ ]* 13.8 Escrever teste de propriedade para criação de posts a partir de variações
    - **Propriedade 14: Criação de posts a partir de variações selecionadas**
    - **Valida: Requisitos 14.3**

- [x] 14. Implementar salvamento automático, offline e sincronização
  - [x] 14.1 Criar hook `useSalvamentoAutomatico` em `src/hooks/useSalvamentoAutomatico.ts`
    - Implementar debounce de 2 segundos para salvamento automático
    - Exibir indicador visual de salvamento (`IndicadorSalvamento`)
    - _Requisitos: 17.1, 17.2_

  - [ ]* 14.2 Escrever teste de propriedade para debounce de salvamento
    - **Propriedade 16: Debounce de salvamento automático**
    - **Valida: Requisitos 17.1**

  - [x] 14.3 Criar `sincronizacaoService` em `src/services/sincronizacaoService.ts`
    - Implementar: `sincronizarDadosOffline`, `armazenarLocal` (localStorage/IndexedDB), `obterDadosLocais`
    - _Requisitos: 17.3, 18.3, 18.4_

  - [x] 14.4 Criar hook `useConexao` em `src/hooks/useConexao.ts` e `ContextoConexao`
    - Detectar estado online/offline via `navigator.onLine` e eventos `online`/`offline`
    - Criar `src/contexts/ContextoConexao.tsx`
    - Componente `IndicadorOffline` para exibir banner de estado offline
    - _Requisitos: 18.2, 18.5_

  - [x] 14.5 Criar hook `useSincronizacao` em `src/hooks/useSincronizacao.ts`
    - Sincronizar dados locais com Firestore ao reconectar
    - _Requisitos: 17.3, 18.4_

  - [ ]* 14.6 Escrever teste de propriedade para sincronização offline
    - **Propriedade 17: Sincronização offline (round-trip)**
    - **Valida: Requisitos 17.3, 18.3, 18.4**

  - [ ]* 14.7 Escrever teste de propriedade para isolamento de dados por usuário
    - **Propriedade 18: Isolamento de dados por usuário**
    - **Valida: Requisitos 17.4**

  - [x] 14.8 Configurar Service Worker para PWA
    - Registrar Service Worker para cache de assets estáticos
    - Configurar Service Worker manual
    - Permitir visualização offline de conteúdos previamente carregados
    - _Requisitos: 18.1, 18.2_

- [x] 15. Checkpoint — Verificar offline e sincronização
  - Garantir que todos os testes passam, perguntar ao usuário se há dúvidas.

- [x] 16. Implementar navegação, layout responsivo e dashboard
  - [x] 16.1 Criar componente `MenuNavegacao` em `src/components/MenuNavegacao.tsx`
    - Menu inferior para mobile (abas), sidebar para desktop
    - Links para: Dashboard, Ideias, Calendário, Modo Growth, Perfil
    - _Requisitos: 20.3_

  - [x] 16.2 Criar `PaginaPrincipal` (Dashboard)
    - `src/pages/PaginaPrincipal.tsx`: resumo de posts por status, acesso rápido a funcionalidades principais, últimas métricas
    - _Requisitos: 1.2_

  - [x] 16.3 Aplicar layout responsivo mobile-first em todos os componentes
    - Breakpoints: mobile (até 768px), tablet (769-1024px), desktop (acima de 1024px)
    - Área de toque mínima 44x44px em mobile
    - Acessibilidade WCAG 2.1 AA: contraste, labels, navegação por teclado
    - _Requisitos: 20.1, 20.2, 20.3, 20.4, 20.5_

- [ ] 17. Integrar persistência round-trip e testes finais de propriedade
  - [ ]* 17.1 Escrever teste de propriedade para persistência round-trip
    - **Propriedade 6: Persistência e recuperação de dados (round-trip)**
    - **Valida: Requisitos 2.2, 5.3, 6.3, 7.5, 8.4, 10.5, 15.2, 15.3**

- [ ] 18. Checkpoint final — Garantir integridade completa
  - Garantir que todos os testes passam, perguntar ao usuário se há dúvidas.

## Notas

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada tarefa referencia requisitos específicos para rastreabilidade
- Checkpoints garantem validação incremental
- Testes de propriedade validam propriedades universais de corretude
- Toda nomenclatura de código em português brasileiro conforme steering
- Linguagem de implementação: TypeScript
