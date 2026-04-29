# Documento de Requisitos — InstaFlow: PWA de Marketing para Instagram com IA

## Introdução

O InstaFlow é uma aplicação PWA (Progressive Web App) construída com React 19 + TypeScript, focada em marketing para Instagram com auxílio de inteligência artificial. O sistema permite que usuários criem, organizem e publiquem conteúdos para Instagram de forma assistida por IA, aumentando engajamento e aquisição de seguidores. A aplicação utiliza Firebase (Firestore + Auth) como backend, consome a API da OpenAI diretamente no frontend e não possui backend próprio.

## Glossário

- **Sistema**: A aplicação InstaFlow como um todo
- **Agente_IA**: Módulo responsável por consumir a API da OpenAI para geração de conteúdo (legendas, hashtags, ideias, roteiros)
- **Gerador_Criativos**: Módulo responsável por gerar e editar imagens/criativos usando IA de imagem e templates editáveis
- **Calendario**: Módulo de planejamento e organização de postagens futuras com visualização em calendário
- **Publicador**: Módulo de publicação assistida que prepara conteúdo para publicação manual no Instagram
- **Analisador**: Módulo de registro e análise de métricas de engajamento
- **Autenticador**: Módulo de autenticação de usuários via Firebase Auth
- **Perfil_Usuario**: Conjunto de dados do usuário incluindo nicho, público-alvo e objetivo de marketing
- **Post**: Unidade de conteúdo composta por imagem/criativo, legenda, hashtags e metadados de agendamento
- **Tom_Comunicacao**: Estilo de escrita selecionado pelo usuário (formal, vendas, descontraído)
- **Modo_Growth**: Funcionalidade que gera automaticamente um plano semanal completo de posts
- **Status_Post**: Estado do post no fluxo de trabalho (rascunho, agendado, publicado)
- **Metrica**: Dado de engajamento registrado manualmente (curtidas, comentários, alcance)
- **Plano_Semanal**: Conjunto de posts gerados automaticamente para uma semana, incluindo ideias, legendas, hashtags e horários sugeridos

## Requisitos

### Requisito 1: Autenticação de Usuários

**User Story:** Como um usuário, eu quero me autenticar na aplicação de forma segura, para que eu possa acessar meus conteúdos e dados salvos.

#### Critérios de Aceitação

1. WHEN o usuário acessa o Sistema pela primeira vez, THE Autenticador SHALL exibir a tela de login com opções de autenticação via e-mail/senha e login social (Google)
2. WHEN o usuário submete credenciais válidas de e-mail e senha, THE Autenticador SHALL autenticar o usuário via Firebase Auth e redirecionar para a tela principal
3. WHEN o usuário submete credenciais inválidas, THE Autenticador SHALL exibir uma mensagem de erro descritiva informando o motivo da falha
4. WHEN o usuário seleciona login via Google, THE Autenticador SHALL iniciar o fluxo OAuth do Firebase Auth e autenticar o usuário
5. WHEN o usuário não possui conta, THE Autenticador SHALL permitir o cadastro com e-mail e senha, criando o registro no Firebase Auth
6. WHEN o usuário autenticado clica em "sair", THE Autenticador SHALL encerrar a sessão e redirecionar para a tela de login
7. WHILE o usuário não está autenticado, THE Sistema SHALL bloquear o acesso a todas as rotas protegidas e redirecionar para a tela de login

### Requisito 2: Configuração do Perfil de Marketing

**User Story:** Como um usuário, eu quero configurar meu perfil de marketing informando nicho, público-alvo e objetivo, para que a IA gere conteúdos personalizados para minha estratégia.

#### Critérios de Aceitação

1. WHEN o usuário acessa a configuração de perfil, THE Sistema SHALL exibir um formulário com campos para nicho, público-alvo e objetivo de marketing (vendas, engajamento, leads)
2. WHEN o usuário preenche e salva o Perfil_Usuario, THE Sistema SHALL persistir os dados no Firestore vinculados ao identificador do usuário autenticado
3. WHEN o usuário edita o Perfil_Usuario existente, THE Sistema SHALL atualizar os dados no Firestore e refletir as alterações em todas as gerações futuras de conteúdo
4. IF o usuário tenta salvar o Perfil_Usuario com campos obrigatórios vazios, THEN THE Sistema SHALL exibir mensagens de validação indicando os campos pendentes
5. THE Agente_IA SHALL utilizar os dados do Perfil_Usuario (nicho, público-alvo, objetivo) como contexto em todas as gerações de conteúdo

### Requisito 3: Geração de Ideias de Posts

**User Story:** Como um usuário, eu quero que a IA gere ideias de posts com base no meu nicho, para que eu tenha inspiração constante para criar conteúdo relevante.

#### Critérios de Aceitação

1. WHEN o usuário solicita geração de ideias, THE Agente_IA SHALL enviar uma requisição à API da OpenAI contendo o nicho, público-alvo e objetivo do Perfil_Usuario e retornar uma lista de ideias de posts
2. WHEN a API da OpenAI retorna as ideias com sucesso, THE Sistema SHALL exibir as ideias em formato de lista permitindo seleção individual
3. WHEN o usuário seleciona uma ideia da lista, THE Sistema SHALL permitir que o usuário edite a ideia antes de utilizá-la
4. IF a requisição à API da OpenAI falha, THEN THE Agente_IA SHALL exibir uma mensagem de erro descritiva e oferecer a opção de tentar novamente
5. THE Agente_IA SHALL permitir que o usuário escolha o Tom_Comunicacao (formal, vendas, descontraído) antes de gerar as ideias

### Requisito 4: Geração de Legendas com Foco em Conversão

**User Story:** Como um usuário, eu quero que a IA crie legendas otimizadas para conversão, para que meus posts tenham maior engajamento e resultados.

#### Critérios de Aceitação

1. WHEN o usuário solicita a geração de legenda para um post, THE Agente_IA SHALL gerar uma legenda utilizando o contexto do Perfil_Usuario, o Tom_Comunicacao selecionado e a ideia do post
2. WHEN a legenda é gerada com sucesso, THE Sistema SHALL exibir a legenda em um campo editável permitindo ajustes manuais pelo usuário
3. WHEN o usuário solicita variações, THE Agente_IA SHALL gerar versões alternativas da legenda mantendo o mesmo contexto
4. THE Agente_IA SHALL incluir chamadas para ação (CTAs) relevantes nas legendas geradas com base no objetivo do Perfil_Usuario
5. IF a geração de legenda falha, THEN THE Agente_IA SHALL exibir uma mensagem de erro e permitir nova tentativa

### Requisito 5: Sugestão de Hashtags Relevantes

**User Story:** Como um usuário, eu quero receber sugestões de hashtags relevantes para meu nicho, para que meus posts alcancem mais pessoas.

#### Critérios de Aceitação

1. WHEN o usuário solicita sugestão de hashtags, THE Agente_IA SHALL gerar uma lista de hashtags relevantes com base no nicho do Perfil_Usuario e no conteúdo do post
2. WHEN as hashtags são geradas, THE Sistema SHALL exibir as hashtags em formato de tags selecionáveis, permitindo que o usuário adicione ou remova hashtags individualmente
3. WHEN o usuário confirma a seleção de hashtags, THE Sistema SHALL associar as hashtags selecionadas ao Post correspondente
4. THE Agente_IA SHALL categorizar as hashtags sugeridas por relevância (alta, média, baixa) para orientar a seleção do usuário

### Requisito 6: Geração de Roteiros para Reels

**User Story:** Como um usuário, eu quero que a IA gere roteiros para reels, para que eu possa criar vídeos curtos com conteúdo estruturado e envolvente.

#### Critérios de Aceitação

1. WHEN o usuário solicita a geração de roteiro para reel, THE Agente_IA SHALL gerar um roteiro estruturado (gancho, desenvolvimento, CTA) utilizando o contexto do Perfil_Usuario e o Tom_Comunicacao selecionado
2. WHEN o roteiro é gerado, THE Sistema SHALL exibir o roteiro em seções editáveis (gancho, desenvolvimento, chamada para ação)
3. WHEN o usuário edita o roteiro gerado, THE Sistema SHALL salvar as alterações no Firestore vinculadas ao Post correspondente
4. IF a geração do roteiro falha, THEN THE Agente_IA SHALL exibir uma mensagem de erro descritiva e permitir nova tentativa

### Requisito 7: Geração de Criativos com IA de Imagem

**User Story:** Como um usuário, eu quero gerar imagens para meus posts usando IA, para que eu possa criar conteúdo visual profissional sem ferramentas externas.

#### Critérios de Aceitação

1. WHEN o usuário solicita a geração de imagem, THE Gerador_Criativos SHALL enviar um prompt à API de geração de imagem da OpenAI (DALL-E) e exibir a imagem resultante
2. WHEN a imagem é gerada, THE Sistema SHALL exibir uma pré-visualização da imagem e permitir que o usuário aceite, rejeite ou solicite uma nova geração
3. THE Gerador_Criativos SHALL permitir que o usuário selecione o formato do criativo (post quadrado 1080x1080, story 1080x1920, capa de reel 1080x1920)
4. IF a geração de imagem falha, THEN THE Gerador_Criativos SHALL exibir uma mensagem de erro descritiva e permitir nova tentativa
5. WHEN o usuário aceita a imagem gerada, THE Sistema SHALL armazenar a URL da imagem no Firestore vinculada ao Post correspondente

### Requisito 8: Templates Editáveis para Criativos

**User Story:** Como um usuário, eu quero editar templates de criativos inserindo textos e CTAs personalizados, para que eu possa personalizar o conteúdo visual antes de publicar.

#### Critérios de Aceitação

1. THE Gerador_Criativos SHALL disponibilizar templates editáveis nos formatos post, story e capa de reel
2. WHEN o usuário seleciona um template, THE Gerador_Criativos SHALL exibir o template em um editor visual permitindo inserção de textos e CTAs
3. WHEN o usuário edita textos ou CTAs no template, THE Gerador_Criativos SHALL renderizar as alterações em tempo real na pré-visualização
4. WHEN o usuário finaliza a edição do template, THE Sistema SHALL salvar o criativo resultante no Firestore vinculado ao Post correspondente

### Requisito 9: Calendário de Postagens

**User Story:** Como um usuário, eu quero visualizar e organizar meus posts em um calendário, para que eu possa planejar minha estratégia de conteúdo de forma visual.

#### Critérios de Aceitação

1. THE Calendario SHALL exibir uma visualização mensal com os posts organizados por data de agendamento
2. WHEN o usuário clica em uma data no Calendario, THE Sistema SHALL permitir a criação de um novo Post associado àquela data
3. WHEN o usuário arrasta um Post para outra data, THE Calendario SHALL atualizar a data de agendamento do Post no Firestore
4. THE Calendario SHALL exibir indicadores visuais diferenciados para cada Status_Post (rascunho, agendado, publicado)
5. WHEN o usuário clica em um Post no Calendario, THE Sistema SHALL abrir os detalhes do Post para visualização e edição

### Requisito 10: Gerenciamento de Status dos Posts

**User Story:** Como um usuário, eu quero gerenciar o status dos meus posts (rascunho, agendado, publicado), para que eu possa acompanhar o progresso do meu planejamento de conteúdo.

#### Critérios de Aceitação

1. WHEN um novo Post é criado, THE Sistema SHALL atribuir o Status_Post "rascunho" como valor padrão
2. WHEN o usuário define uma data de agendamento para um Post com Status_Post "rascunho", THE Sistema SHALL alterar o Status_Post para "agendado"
3. WHEN o usuário marca um Post como publicado, THE Sistema SHALL alterar o Status_Post para "publicado" e registrar a data de publicação
4. THE Sistema SHALL permitir que o usuário filtre posts por Status_Post na listagem e no Calendario
5. WHEN o Status_Post de um Post é alterado, THE Sistema SHALL persistir a alteração no Firestore imediatamente

### Requisito 11: Publicação Assistida

**User Story:** Como um usuário, eu quero ter o conteúdo pronto para publicação com opções de copiar e abrir o Instagram, para que eu possa publicar manualmente de forma rápida e prática.

#### Critérios de Aceitação

1. WHEN o usuário acessa a tela de publicação de um Post, THE Publicador SHALL exibir a pré-visualização completa do Post (imagem, legenda, hashtags)
2. WHEN o usuário clica no botão "copiar legenda", THE Publicador SHALL copiar a legenda completa (incluindo hashtags) para a área de transferência do dispositivo e exibir confirmação visual
3. WHEN o usuário clica no botão "abrir Instagram", THE Publicador SHALL abrir o aplicativo Instagram ou o site do Instagram em uma nova aba
4. THE Publicador SHALL apresentar o conteúdo em formato pronto para publicação, sem utilizar automações, bots ou macros que violem as políticas do Instagram
5. WHEN o usuário confirma que publicou o Post, THE Publicador SHALL atualizar o Status_Post para "publicado"

### Requisito 12: Sugestão de Melhores Horários de Postagem

**User Story:** Como um usuário, eu quero receber sugestões de melhores horários para postar, para que eu possa maximizar o engajamento dos meus posts.

#### Critérios de Aceitação

1. WHEN o usuário possui Metricas registradas para posts anteriores, THE Agente_IA SHALL analisar os dados de engajamento e sugerir os melhores horários de postagem
2. WHEN o usuário não possui Metricas suficientes, THE Agente_IA SHALL sugerir horários padrão baseados em boas práticas gerais para o nicho do Perfil_Usuario
3. WHEN o usuário agenda um Post, THE Sistema SHALL exibir o horário sugerido como valor padrão, permitindo alteração manual
4. THE Agente_IA SHALL atualizar as sugestões de horário conforme novas Metricas são registradas

### Requisito 13: Modo Growth — Plano Semanal Automático

**User Story:** Como um usuário, eu quero gerar automaticamente um plano semanal completo de posts, para que eu possa economizar tempo e manter consistência na publicação de conteúdo.

#### Critérios de Aceitação

1. WHEN o usuário ativa o Modo_Growth, THE Agente_IA SHALL gerar um Plano_Semanal completo contendo ideias de posts, legendas, hashtags e horários sugeridos para cada dia da semana
2. WHEN o Plano_Semanal é gerado, THE Sistema SHALL exibir todos os posts do plano em formato de lista e no Calendario, permitindo revisão individual
3. WHEN o usuário aprova o Plano_Semanal, THE Sistema SHALL criar os Posts individuais no Firestore com Status_Post "agendado" e as datas correspondentes
4. WHEN o usuário rejeita um post individual do Plano_Semanal, THE Agente_IA SHALL gerar uma alternativa para aquele dia específico
5. THE Agente_IA SHALL utilizar o Perfil_Usuario (nicho, público-alvo, objetivo) e o Tom_Comunicacao para personalizar todo o Plano_Semanal

### Requisito 14: Geração de Múltiplos Conteúdos a Partir de Uma Ideia

**User Story:** Como um usuário, eu quero gerar múltiplos conteúdos a partir de uma única ideia, para que eu possa maximizar o aproveitamento de cada tema.

#### Critérios de Aceitação

1. WHEN o usuário seleciona uma ideia e solicita expansão, THE Agente_IA SHALL gerar múltiplas variações de conteúdo (post, story, reel) a partir da ideia original
2. WHEN as variações são geradas, THE Sistema SHALL exibir cada variação com legenda, hashtags e formato sugerido, permitindo edição individual
3. WHEN o usuário seleciona variações desejadas, THE Sistema SHALL criar Posts individuais no Firestore para cada variação selecionada
4. IF a geração de variações falha, THEN THE Agente_IA SHALL exibir uma mensagem de erro e permitir nova tentativa

### Requisito 15: Registro Manual de Métricas

**User Story:** Como um usuário, eu quero registrar manualmente as métricas dos meus posts (curtidas, comentários), para que o sistema possa analisar meu desempenho e sugerir melhorias.

#### Critérios de Aceitação

1. WHEN o usuário acessa um Post com Status_Post "publicado", THE Analisador SHALL exibir um formulário para registro de Metricas (curtidas, comentários, alcance, salvamentos)
2. WHEN o usuário submete as Metricas, THE Analisador SHALL persistir os dados no Firestore vinculados ao Post correspondente
3. WHEN o usuário edita Metricas já registradas, THE Analisador SHALL atualizar os dados no Firestore
4. IF o usuário submete Metricas com valores não numéricos, THEN THE Analisador SHALL exibir mensagem de validação solicitando valores numéricos válidos

### Requisito 16: Análise e Sugestões de Melhoria

**User Story:** Como um usuário, eu quero receber sugestões de melhoria baseadas nas métricas dos meus posts, para que eu possa otimizar minha estratégia de conteúdo continuamente.

#### Critérios de Aceitação

1. WHEN o usuário possui Metricas registradas para três ou mais posts, THE Analisador SHALL calcular médias de engajamento e exibir um painel resumo de desempenho
2. WHEN o usuário solicita análise de desempenho, THE Agente_IA SHALL analisar as Metricas registradas e gerar sugestões de melhoria personalizadas (tipos de conteúdo, horários, tom de comunicação)
3. THE Analisador SHALL exibir gráficos comparativos de desempenho entre posts para facilitar a identificação de padrões
4. IF o usuário não possui Metricas suficientes para análise, THEN THE Analisador SHALL exibir uma mensagem orientando o registro de métricas em posts publicados

### Requisito 17: Salvamento Automático e Persistência no Firebase

**User Story:** Como um usuário, eu quero que meus dados sejam salvos automaticamente, para que eu não perca conteúdo em caso de falha ou fechamento acidental da aplicação.

#### Critérios de Aceitação

1. WHEN o usuário edita qualquer conteúdo (legenda, hashtags, roteiro, criativo), THE Sistema SHALL salvar as alterações automaticamente no Firestore após um intervalo de inatividade de 2 segundos (debounce)
2. WHEN o salvamento automático é executado com sucesso, THE Sistema SHALL exibir um indicador visual discreto confirmando que os dados foram salvos
3. IF o salvamento automático falha por erro de conexão, THEN THE Sistema SHALL armazenar as alterações localmente e tentar sincronizar quando a conexão for restabelecida
4. THE Sistema SHALL vincular todos os dados persistidos ao identificador do usuário autenticado, garantindo isolamento entre contas

### Requisito 18: Funcionamento Offline (PWA)

**User Story:** Como um usuário, eu quero acessar funcionalidades básicas da aplicação mesmo sem conexão com a internet, para que eu possa continuar trabalhando em qualquer situação.

#### Critérios de Aceitação

1. THE Sistema SHALL registrar um Service Worker que faça cache dos assets estáticos e da estrutura da aplicação para acesso offline
2. WHILE o dispositivo está sem conexão com a internet, THE Sistema SHALL permitir a visualização de posts e conteúdos previamente carregados
3. WHILE o dispositivo está sem conexão, THE Sistema SHALL permitir a edição de posts existentes e armazenar as alterações localmente
4. WHEN a conexão com a internet é restabelecida, THE Sistema SHALL sincronizar automaticamente as alterações feitas offline com o Firestore
5. WHILE o dispositivo está sem conexão, THE Sistema SHALL exibir um indicador visual informando o estado offline e as limitações de funcionalidade (geração de IA indisponível)

### Requisito 19: Segurança no Consumo de APIs

**User Story:** Como um usuário, eu quero que minhas chaves de API e dados estejam protegidos, para que informações sensíveis não sejam expostas.

#### Critérios de Aceitação

1. THE Sistema SHALL armazenar chaves de API (OpenAI, Firebase) exclusivamente em variáveis de ambiente, sem incluí-las no código-fonte
2. THE Sistema SHALL configurar regras de segurança no Firestore que restrinjam o acesso de leitura e escrita exclusivamente aos dados do usuário autenticado
3. WHEN o Sistema realiza requisições à API da OpenAI, THE Sistema SHALL utilizar a chave de API armazenada em variável de ambiente sem expô-la em logs ou respostas de rede visíveis ao usuário
4. THE Sistema SHALL incluir o arquivo de variáveis de ambiente (.env) no .gitignore para evitar versionamento acidental de chaves sensíveis

### Requisito 20: Interface Responsiva e Mobile-First

**User Story:** Como um usuário, eu quero uma interface moderna e responsiva otimizada para dispositivos móveis, para que eu possa gerenciar meu conteúdo de qualquer dispositivo com boa experiência.

#### Critérios de Aceitação

1. THE Sistema SHALL renderizar a interface seguindo a abordagem mobile-first, com breakpoints para dispositivos móveis (até 768px), tablets (769px a 1024px) e desktops (acima de 1024px)
2. THE Sistema SHALL garantir que todos os elementos interativos (botões, campos, menus) possuam área de toque mínima de 44x44 pixels em dispositivos móveis
3. THE Sistema SHALL utilizar navegação por abas ou menu inferior em dispositivos móveis para acesso rápido às funcionalidades principais
4. THE Sistema SHALL adaptar o layout do Calendario para visualização compacta em dispositivos móveis
5. THE Sistema SHALL seguir padrões de acessibilidade WCAG 2.1 nível AA, incluindo contraste adequado, labels em formulários e navegação por teclado
