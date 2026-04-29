# 🚀 Prompt de Steering para Criação de Projeto

Crie um projeto web utilizando **TypeScript** seguindo rigorosamente as diretrizes abaixo.

---

## 🧱 Estrutura de Pastas (OBRIGATÓRIA)

A estrutura do projeto deve ser exatamente:

```
src/
  assets/
  components/
  contexts/
  hooks/
  services/
  types/
  utils/
  pages/
  routes/
  database/
```

### Regras:

* Não criar pastas fora desse padrão
* Manter separação clara de responsabilidades
* Código deve ser modular e organizado

---

## 🧠 Linguagem e Tecnologias

* Utilizar **TypeScript** obrigatoriamente
* Não utilizar JavaScript puro
* Tipagem forte em todo o projeto
* Evitar uso de `any`

---

## 🇧🇷 Nomenclatura (OBRIGATÓRIA)

Todo o código deve estar em **português**:

### Variáveis:

* `nomeUsuario`
* `listaProdutos`

### Funções / Métodos:

* `obterUsuarios`
* `calcularTotalPedido`

### Componentes:

* `BotaoConfirmacao`
* `ListaProdutos`

### Hooks:

* `useAutenticacao`
* `useCarrinho`

### Services:

* `usuarioService`
* Métodos como: `listarUsuarios`, `criarUsuario`

---

## 📦 Organização por Responsabilidade

* **components/** → componentes reutilizáveis e desacoplados
* **pages/** → telas da aplicação
* **services/** → regras de negócio e acesso a API
* **contexts/** → estado global
* **hooks/** → lógica reutilizável
* **utils/** → funções utilitárias puras
* **types/** → tipagens globais
* **database/** → configuração/acesso a dados
* **roter/** → configuração de rotas
* **assets/** → arquivos estáticos

---

## 🧩 Boas Práticas

* Seguir SOLID
* Evitar duplicação de código
* Criar funções pequenas e reutilizáveis
* Priorizar legibilidade
* Separar claramente responsabilidade entre camadas

---

## 🔒 Regras de Qualidade

* Código deve ser tipado corretamente
* Deve conter tratamento de erros
* Deve ser legível e organizado
* Deve seguir a arquitetura definida

---

## ⚠️ Restrições

* Não usar inglês em nomes de variáveis, funções ou arquivos
* Não criar estruturas fora do padrão
* Não ignorar tipagem
* Não misturar responsabilidades

---

## ✅ Resultado Esperado

O projeto deve:

* Estar estruturado conforme definido
* Estar 100% em TypeScript
* Utilizar nomenclatura em português
* Seguir boas práticas de desenvolvimento
* Estar pronto para escalabilidade e manutenção

---

## 📌 Instrução Final

Gere toda a estrutura inicial do projeto, incluindo:

* Pastas
* Arquivos base
* Exemplos iniciais (componente, página, service, hook e context)

Respeite integralmente todas as diretrizes acima.
