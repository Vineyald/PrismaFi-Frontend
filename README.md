# PrismaFi Frontend

Aplicação web do PrismaFi, construída com Angular e TypeScript.

O PrismaFi é um SaaS financeiro que dá ao usuário uma visão centralizada da sua vida financeira. Ele vai reunir, em uma aplicação web autenticada, instituições conectadas via Open Finance, contas bancárias, saldos, transações e contas a pagar, além da iniciação de pagamentos. A operação financeira é executada por infraestrutura regulada; o PrismaFi orquestra a experiência e nunca tem a custódia do dinheiro do usuário.

Hoje este repositório contém a fundação (o shell da aplicação, a base do design system, uma tela inicial lazy que mostra o status do backend, a estrutura de testes e o CI) e o começo da Fase 1: telas de cadastro e login, com os primeiros componentes de UI reutilizáveis (veja o [Roadmap até o MVP](#roadmap-até-o-mvp)).

O backend fica em um repositório separado (`PrismaFi-Backend`). Os dois se integram **somente** via REST e pelo schema OpenAPI do backend; este repositório nunca importa arquivos do backend.

## Responsabilidades deste repositório

| Pertence ao frontend                                                              | Não pertence ao frontend                                                          |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| UX, layout, navegação e responsividade                                            | Regras de negócio (o backend decide)                                              |
| Acessibilidade                                                                    | Segurança de acesso aos dados (guards só melhoram a UX; quem protege é o backend) |
| Estado de tela com Signals                                                        | Cálculos monetários: o frontend exibe valores, não faz contas com `number`        |
| Validação de formulário para usabilidade                                          | Validação de confiança (sempre repetida no backend)                               |
| Fluxos de autenticação, conexão bancária e pagamento do ponto de vista do usuário | Comunicação direta com bancos ou provedores                                       |
| Design system do PrismaFi                                                         | Definição do contrato da API (o frontend consome os tipos gerados)                |

## Stack tecnológica

| Tecnologia                                 | Por que está aqui                                                                                                                  | Status                                                         |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Angular 22**                             | Framework da aplicação: componentes standalone, Signals, router, HttpClient. Zoneless por padrão.                                  | instalado                                                      |
| **TypeScript 6** (strict)                  | Tipagem de ponta a ponta, incluindo os tipos gerados a partir do schema OpenAPI do backend. `strict` e `strictTemplates` ativados. | instalado                                                      |
| **SCSS**                                   | O design system próprio do PrismaFi: tokens de compilação e CSS custom properties para temas em runtime.                           | instalado                                                      |
| **Signals**                                | Estado local e compartilhado com `signal`, `computed` e `httpResource`. Sem NgRx e sem stores de BehaviorSubject.                  | em uso                                                         |
| **Vitest**                                 | Testes unitários e de componentes, pelo builder `@angular/build:unit-test` com jsdom.                                              | instalado                                                      |
| **Playwright**                             | Testes end-to-end em navegador real (o Google Chrome instalado).                                                                   | instalado                                                      |
| **ESLint** (angular-eslint) + **Prettier** | Lint, incluindo regras de acessibilidade nos templates, e formatação.                                                              | instalado                                                      |
| **Angular CDK**                            | Primitivas de comportamento e acessibilidade (overlays, focus trap, a11y) sob o visual próprio do PrismaFi.                        | planejado: instalar com o primeiro overlay ou menu             |
| **Lucide**                                 | Conjunto de ícones.                                                                                                                | planejado: instalar com o primeiro ícone                       |
| **Apache ECharts**                         | Gráficos financeiros.                                                                                                              | planejado: instalar com o primeiro gráfico que realmente ajude |

Pacotes planejados só são instalados quando um componente precisa deles, seguindo a regra do projeto contra dependências sem uso.

## Arquitetura

```text
PrismaFi-Frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── api/
│   │   │   │   └── schema.d.ts      # GERADO a partir do OpenAPI do backend (npm run api:types)
│   │   │   └── auth/
│   │   │       └── auth.ts          # Chamadas de login/cadastro, token em memória, toAuthFailure
│   │   ├── features/
│   │   │   ├── home/                # Tela inicial (rota lazy)
│   │   │   └── auth/                # Telas de autenticação (rotas lazy /login e /register)
│   │   │       ├── login/ , register/
│   │   │       ├── auth-form.ts     # Validadores, mensagens de falha e foco, comuns às duas telas
│   │   │       ├── auth-page.scss   # Estilo compartilhado pelas duas telas
│   │   │       └── testing.ts       # Helpers dos specs das telas
│   │   ├── shared/
│   │   │   └── ui/                  # button, form-field, inline-alert
│   │   ├── app.ts / app.scss        # Shell da aplicação: header + <router-outlet>
│   │   ├── app.routes.ts            # Rotas lazy
│   │   └── app.config.ts            # Providers: router (com input binding), HttpClient (fetch)
│   ├── styles/
│   │   ├── _tokens.scss             # Tokens de compilação: espaçamento, raios, tipografia, breakpoints
│   │   ├── _themes.scss             # Tema em runtime: custom properties --prisma-*, claro + escuro
│   │   ├── _mixins.scss             # Media query mobile-first `breakpoint($bp)`
│   │   └── _reset.scss              # Reset moderno mínimo
│   ├── styles.scss                  # Entrada global: reset, temas, estilos base do body
│   ├── index.html
│   └── main.ts
├── .github/workflows/ci.yml         # CI: lint, format:check, test, build, e2e
├── e2e/
│   ├── app.spec.ts                  # Testes Playwright: shell e tela inicial
│   └── auth.spec.ts                 # Testes Playwright: cadastro e login
├── public/favicon.svg
├── proxy.conf.json                  # Proxy de desenvolvimento: /api -> http://localhost:8000
├── playwright.config.ts
├── eslint.config.js
└── angular.json
```

| Pasta              | Responsabilidade                                                                                                                                                                                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `core/`            | Infraestrutura não visual, usada pela aplicação inteira. Hoje: o contrato gerado da API e `core/auth/` (chamadas de autenticação e token em memória); o interceptor, os guards e o estado de sessão completo entram ali nas próximas entregas da Fase 1. `features/auth/` contém só as telas e usa `core/auth/`; `core/` nunca importa features. |
| `features/<nome>/` | Uma pasta por área do produto, cada uma com sua rota lazy, componentes, estilos e specs. Uma feature nunca importa detalhes internos de outra.                                                                                                                                                                                                   |
| `styles/`          | Camada global do design system.                                                                                                                                                                                                                                                                                                                  |
| `app.ts`           | O shell. Só vai para uma pasta `layout/` própria quando houver mais de um layout (ex.: público vs. autenticado), o que está previsto para a Fase 1.                                                                                                                                                                                              |

`shared/ui/` contém os componentes de UI reutilizáveis, sem dependência de `core/` ou de features:

- `button[app-button]`: estiliza um `<button>` nativo (semântica, `type` e `disabled` continuam com quem usa). Com `[loading]`, mostra um spinner, fica `aria-disabled` (sem perder o foco) e cancela cliques, inclusive o clique implícito do Enter num campo, impedindo envio duplicado.
- `app-form-field`: label + input ligado a um `FormControl<string>` tipado, com indicação de obrigatório, dica e mensagem de erro (ligada por `aria-describedby`) depois que o campo é tocado. Erros sem mensagem padrão levam o texto no próprio valor (`{ mismatch: '...' }`, `{ server: '...' }`).
- `app-inline-alert`: feedback contextual. `error` usa `role="alert"`; `warning` e `info` usam `role="status"`. Cada variante tem ícone de formato próprio e um rótulo oculto, para não depender só da cor.

`layout/` **ainda não existe, de propósito**: nasce com o layout autenticado. Outras pastas de `shared/` (ex.: `shared/format/` para valores em BRL) nascem com o primeiro uso.

## Padrões Angular

| Convenção             | Regra                                                                                                                                                                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Standalone            | Só componentes, sem NgModules. A flag `standalone: true` é implícita.                                                                                                                                                                                |
| Signals               | `signal()` para estado e `computed()` para valores derivados. `effect()` só para efeitos colaterais reais, como sincronizar DOM ou storage.                                                                                                          |
| Busca de dados        | `httpResource()` para leituras: baseado em signals, sem subscriptions manuais. Observables do HttpClient só para mutações ou streaming.                                                                                                              |
| Control flow          | `@if`, `@for`, `@switch`. Sem diretivas estruturais.                                                                                                                                                                                                 |
| DI                    | `inject()`, não injeção pelo construtor.                                                                                                                                                                                                             |
| Rotas                 | Toda feature é carregada sob demanda com `loadComponent` ou `loadChildren`.                                                                                                                                                                          |
| Guards / interceptors | Só funcionais (`CanActivateFn`, `HttpInterceptorFn`). Guards são declarados nas rotas (`canActivate` / `canMatch`); interceptors são registrados via `provideHttpClient(withInterceptors(...))`. Ainda não há nenhum: entram com a sessão (refresh). |
| Formulários           | Typed Reactive Forms (`FormControl<T>`, `NonNullableFormBuilder`), exibidos com `app-form-field`. Regras espelham as do backend em `features/auth/auth-form.ts`.                                                                                     |
| Tipos da API          | Sempre de `core/api/schema.d.ts`. Nunca escreva à mão o formato dos dados do backend.                                                                                                                                                                |

## Estilos

O PrismaFi tem identidade visual própria. Ele **não usa Tailwind, Bootstrap, DaisyUI nem Angular Material** como design system.

- **Tokens (`_tokens.scss`)** são variáveis SCSS para valores fixos em tempo de build: escala de espaçamento (`$space-*`), altura de controles (`$control-height`), raios, fonte, escala tipográfica, pesos, alturas de linha e breakpoints. Os componentes os carregam com `@use 'tokens' as *;` (`src/styles` está no include path do SCSS). Um token só é criado quando um componente precisa dele, e o Sass falha em variáveis indefinidas.
- **Temas (`_themes.scss`)** são CSS custom properties para tudo o que muda em runtime: `--prisma-bg`, `--prisma-surface`, `--prisma-border`, `--prisma-text`, `--prisma-text-muted`, `--prisma-accent`, `--prisma-on-accent` (texto sobre o accent), `--prisma-accent-2`, `--prisma-positive`, `--prisma-warning`, `--prisma-danger`, `--prisma-shadow` e `--prisma-gradient-brand`. O tema claro é o padrão e o escuro segue o `prefers-color-scheme`. Um seletor manual de tema pode, no futuro, sobrescrever as mesmas propriedades via `[data-theme]`.
- **Estilos de componente** ficam junto do componente (`*.scss`, encapsulamento emulado). Usam tokens e `var(--prisma-*)`, não cores ou espaçamentos fixos no código. Estilos globais se limitam a reset, tema e tipografia base.
- **Responsividade**: mobile-first, com `@include breakpoint($bp-md) { ... }` (ou pelo nome: `breakpoint(md)`).
- **Acessibilidade**: anel global de `:focus-visible`, `prefers-reduced-motion` respeitado no reset, contraste de texto de pelo menos 3:1 para texto grande e 4,5:1 para texto comum, e as regras de acessibilidade do ESLint nos templates.

## Configuração do ambiente

Pré-requisitos: Node 24 e npm 11. O Google Chrome é necessário para os testes E2E. Use o backend para ter dados reais.

```bash
# 1. Clonar
git clone <repo-url> PrismaFi-Frontend
cd PrismaFi-Frontend

# 2. Instalar dependências
npm install

# 3. Variáveis de ambiente: nada a configurar.
#    A aplicação chama a API com URLs relativas (/api); o proxy de desenvolvimento as encaminha.

# 4. Servidor de desenvolvimento: http://localhost:4200
npm start

# 5. Build de produção: saída em dist/PrismaFi-Frontend/browser
npm run build

# 6. Testes unitários (Vitest)
npm test

# 7. Testes E2E (Playwright; sobe o servidor de desenvolvimento sozinho e não precisa do backend)
npm run e2e

# Lint e formatação
npm run lint
npm run format:check
```

Sem o backend rodando, a aplicação funciona normalmente e a tela inicial mostra **API offline**.

## Integração com o backend

```text
Angular (localhost:4200) --REST /api/*--> proxy de desenvolvimento do Angular --> FastAPI (localhost:8000)
```

- **Nenhum host de API fixo no código.** Todas as chamadas usam caminhos relativos (`/api/...`). Em desenvolvimento, o proxy do Angular as encaminha. Em produção, a mesma origem serve a aplicação e encaminha `/api` para o backend por um reverse proxy. Isso evita CORS por completo e dispensa arquivos `environment.ts`. Se um dia a API precisar estar em outra origem, introduza então uma única URL base da API.
- **Contrato vindo do OpenAPI.** O backend é a fonte da verdade. Os tipos são gerados, não escritos à mão:

  ```bash
  # Backend rodando em modo de desenvolvimento (ele serve /api/openapi.json)
  npm run api:types
  ```

  O comando roda o `openapi-typescript` (versão fixada, via `npx`) e escreve `src/app/core/api/schema.d.ts`. O arquivo contém só tipos, sem código de runtime. Use os tipos com o HttpClient do próprio Angular ou com `httpResource`:

  ```ts
  import type { components } from '../../core/api/schema';
  type HealthResponse = components['schemas']['HealthResponse'];
  httpResource<HealthResponse>(() => '/api/health');
  ```

  Faça commit do arquivo gerado e gere de novo sempre que o contrato do backend mudar. Um erro de compilação depois de gerar significa que o contrato mudou por baixo do seu código, e é exatamente para isso que ele serve. As fixtures de teste usam `satisfies` com os mesmos tipos, então os stubs deixam de compilar quando o contrato muda.

  _Por que não o OpenAPI Generator?_ Ele exige Java e gera um cliente grande, com services e models para cada endpoint. Com apenas `/api/health`, um arquivo de tipos gerado mais o HttpClient do Angular é a opção mais simples de manter. Vale reavaliar se as chamadas escritas à mão começarem a se repetir.

## Proxy de desenvolvimento

O `proxy.conf.json` está ligado ao `ng serve` pelo `angular.json`:

```json
{ "/api": { "target": "http://localhost:8000", "secure": false } }
```

Toda requisição do navegador para `http://localhost:4200/api/...` é encaminhada pelo servidor de desenvolvimento ao backend, então, para o navegador, tudo está na mesma origem. Por isso o backend mantém o CORS desativado (`CORS_ORIGINS=[]`). O proxy só existe no `ng serve`, não nos builds de produção.

## Testes

- **Vitest** (`npm test`): testes de componente com `TestBed` e `HttpTestingController`. Cobrem:
  - a lógica de status da tela inicial (online, offline com 503, Retry focável enquanto recarrega);
  - os componentes de `shared/ui/`: botão que bloqueia o envio enquanto carrega, campo com label associado, erros só depois de tocado e ligados por `aria-describedby`, alerta com `role` correto;
  - `core/auth`: login guarda o token só em memória, cadastro não autentica, e o mapeamento de erros HTTP (401, 422, rede, servidor);
  - login e cadastro: campos obrigatórios, e-mail inválido, confirmação de senha (revalidada quando a senha muda), foco no primeiro campo inválido, estado de carregamento, envio único, mensagem genérica para credenciais recusadas (inclusive 422 no login), falhas de rede e de servidor distintas, erros de campo vindos do servidor sem o texto bruto, e o aviso de sessão expirada.
- **Playwright** (`npm run e2e`): testes em navegador real contra o `ng serve`, com a API simulada via `page.route` (as fixtures usam os tipos gerados do OpenAPI), então o backend não é necessário. Cobrem a rota lazy, o redirecionamento de rotas desconhecidas, a jornada cadastro → aviso → login → home, login recusado só com teclado, validação no cliente com foco, uma única requisição apesar de cliques e Enter repetidos, o aviso de sessão expirada e a ausência de rolagem horizontal em 360px. O Playwright usa o Google Chrome instalado (`channel: 'chrome'`), então não há download de navegador. Os runners do GitHub Actions já têm o Chrome instalado.

## Roadmap até o MVP

> **Estado atual:** Fase 1 em andamento (cadastro e login entregues).\
> **Próximo marco:** Identidade e autenticação (sessão, logout e perfil).\
> **MVP:** não concluído.

Este roadmap é compartilhado com o `PrismaFi-Backend`: as fases e os marcos são os mesmos nos dois repositórios. Aqui ficam os itens de **frontend** (UX, arquitetura Angular, autenticação, dashboard, conexão bancária, transações, contas a pagar, pagamento, responsividade e acessibilidade). Os itens de domínio, API e integrações estão no README do backend.

### Definição do MVP

O MVP está concluído quando um usuário novo consegue, de forma confiável:

```text
Criar conta → Entrar → Acessar o PrismaFi → Conectar uma instituição financeira
→ Ver contas bancárias, saldos e transações → Cadastrar uma obrigação financeira
→ Vê-la no dashboard → Escolher pagar → Selecionar uma conta de origem elegível
→ Iniciar o pagamento → Autorizá-lo no banco → Acompanhar o resultado no PrismaFi
```

Com eventos de auditoria registrados para as ações financeiras críticas. O MVP **não** precisa suportar todos os bancos, todos os meios de pagamento nem todas as capacidades do Open Finance. O objetivo é provar a proposta de valor completa com o menor produto seguro e útil.

### Visão geral das fases

| Fase | Marco                                     | Status           |
| ---- | ----------------------------------------- | ---------------- |
| 0    | Fundação técnica                          | Concluída        |
| 1    | Identidade e autenticação                 | **Em andamento** |
| 2    | Shell da aplicação e design system        | Planejada        |
| 3    | Integração com provedor de Open Finance   | Planejada        |
| 4    | Contas bancárias, saldos e transações     | Planejada        |
| 5    | Contas a pagar e obrigações financeiras   | Planejada        |
| 6    | Dashboard financeiro                      | Planejada        |
| 7    | Iniciação de pagamentos                   | Planejada        |
| 8    | Notificações e confiabilidade operacional | Planejada        |
| 9    | Hardening do MVP                          | Planejada        |
| 10   | Lançamento do MVP                         | Planejada        |

### Fase 0 — Fundação técnica

**Status: concluída.** Itens verificados no repositório.

- [x] Angular 22 standalone e zoneless, com TypeScript `strict` e `strictTemplates`
- [x] Rotas lazy (`loadComponent`) com redirecionamento de rotas desconhecidas
- [x] Signals e `httpResource` em uso (status da API na tela inicial)
- [x] Base do design system em SCSS: tokens, temas claro e escuro via custom properties, reset e mixin de breakpoint
- [x] Shell mínimo e tela inicial responsivos
- [x] Proxy de desenvolvimento `/api` para o backend
- [x] Tipos da API gerados a partir do OpenAPI (`npm run api:types`)
- [x] Vitest, Playwright, ESLint (com regras de acessibilidade) e Prettier

### Fase 1 — Identidade e autenticação

**Objetivo:** estabelecer a fundação de identidade segura do PrismaFi.\
**Entrega conjunta:** o usuário cria conta, entra, gerencia o perfil e as sessões ativas, e sai.

- [x] CI no GitHub Actions: `lint`, `format:check`, `test`, `build`, `e2e`
- [x] `@angular/forms` com Typed Reactive Forms (primeiro formulário)
- [x] Primeiros componentes base em `shared/ui/`, criados com o primeiro formulário: botão, campo de formulário e alerta inline (erros de autenticação, sessão expirada)
- [x] Feature `auth`: telas de cadastro e login, com validação, estados de carregamento e mensagens de erro que não revelam se o e-mail existe. O login aceita `?notice=session-expired`, base para o aviso de sessão expirada
- [ ] Verificação de e-mail e recuperação de senha (telas de solicitação e de redefinição)
- [ ] Estado de autenticação com Signals em `core/auth/` (usuário atual, status da sessão), sem store externo
- [ ] Restauração da sessão na inicialização: `provideAppInitializer` tenta um refresh uma única vez e resolve o estado (`autenticado`, `anônimo`) antes de qualquer guard decidir; reload e deep link não mandam para o login
- [ ] Access token só em memória; refresh por cookie `HttpOnly` gerenciado pelo backend
- [ ] Interceptor funcional: anexa o access token **só** em requests para `/api/`; em um 401, renova uma única vez (requisições concorrentes aguardam a mesma renovação) e refaz o request no máximo uma vez (flag via `HttpContextToken`); nunca tenta renovar em `/api/v1/auth/*`; encerra a sessão se a renovação falhar
- [ ] Várias abas: o backend aceita o refresh token anterior por alguns segundos após a rotação (veja o README do backend), e logout em uma aba é propagado para as outras via `BroadcastChannel`
- [ ] Guards funcionais: rotas autenticadas e rotas só para visitantes
- [ ] Logout, logout de todos os dispositivos e tela de sessões ativas
- [ ] Tela de perfil
- [ ] Comportamento de sessão expirada: aviso claro e volta ao login preservando a rota de destino; o `returnUrl` só aceita caminhos internos (começa com `/`, nunca `//` ou `/\`), com fallback para o dashboard
- [ ] Layouts separados: público (auth) e autenticado; nasce a pasta `layout/`
- [ ] Testes unitários do interceptor (token só em `/api/`, sem loop de refresh, retry único) e dos guards (incluindo `returnUrl` externo rejeitado); E2E de cadastro → login → reload → logout e de duas abas renovando ao mesmo tempo

### Fase 2 — Shell da aplicação e design system

**Objetivo:** criar a experiência autenticada real do PrismaFi.\
**Entrega conjunta:** layout autenticado navegável, com os estados de carregamento, vazio e erro padronizados.

- [ ] Layout principal: sidebar/navegação, header com menu do usuário, área de conteúdo
- [ ] Navegação responsiva (menu recolhível no mobile)
- [ ] Shell do dashboard (placeholder com estados vazios)
- [ ] Demais componentes base, criados só quando usados: card, diálogo e toast (com Angular CDK para overlay e focus trap) e ícones com Lucide
- [ ] Estados padronizados: carregando (skeleton), vazio e erro com ação de tentar novamente
- [ ] Exibição de valores financeiros em `shared/format/`: `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })` aplicado à string decimal da API (não usar `CurrencyPipe` nem `Number()`, que passam por float); cores de positivo e negativo acessíveis

### Fase 3 — Integração com provedor de Open Finance

**Objetivo:** permitir que o usuário conecte uma instituição financeira real.\
**Entrega conjunta:** o usuário conecta pelo menos uma instituição suportada e vê o status da conexão.

O fluxo exato depende do provedor escolhido na avaliação técnica (veja o README do backend).

- [ ] Ação "Conectar instituição" e seleção da instituição (ou widget do provedor, se ele exigir)
- [ ] Redirecionamento para autorização no banco/provedor e tela de retorno (callback) com estado de "finalizando conexão"
- [ ] Telas de sucesso e falha da conexão, com orientação clara
- [ ] Lista de instituições conectadas com status do consentimento (ativo, expirando, expirado, com erro)
- [ ] Reconectar e remover conexão, quando o provedor permitir
- [ ] E2E do fluxo de conexão com o provedor simulado

### Fase 4 — Contas bancárias, saldos e transações

**Objetivo:** entregar a primeira grande proposta de valor: uma visão financeira única.\
**Entrega conjunta:** o usuário vê suas contas, saldos e o histórico de transações sincronizados.

- [ ] Cards de contas bancárias por instituição e saldo consolidado (totais calculados pelo backend e só formatados no frontend)
- [ ] Detalhe da conta
- [ ] Histórico de transações com filtros por conta e período e paginação por cursor ("carregar mais")
- [ ] Status de sincronização e indicador de "última sincronização"
- [ ] Estados vazio (nenhuma conta conectada) e de erro de sincronização
- [ ] Primeiros números reais no dashboard

### Fase 5 — Contas a pagar e obrigações financeiras

**Objetivo:** o PrismaFi começa a responder "o que eu preciso pagar?".\
**Entrega conjunta:** o usuário cadastra, edita e acompanha suas obrigações, incluindo as próximas e as vencidas.

- [ ] Lista de obrigações, com destaque para próximas e vencidas
- [ ] Criar e editar obrigação: título, descrição, valor, vencimento, recorrência opcional e dados de pagamento (ex.: chave Pix)
- [ ] Campo de valor como `FormControl<string>` com `inputmode="decimal"`: o texto em pt-BR (`1.234,56`) é normalizado para string decimal (`1234.56`) por manipulação de string, nunca via `Number`; validação de formato e de 2 casas decimais (o backend continua sendo a autoridade)
- [ ] Detalhe da obrigação
- [ ] Estados visuais: em aberto, próxima do vencimento, vencida, paga
- [ ] Integração com o dashboard

### Fase 6 — Dashboard financeiro

**Objetivo:** oferecer uma visão consolidada útil antes de introduzir pagamentos.\
**Entrega conjunta:** o dashboard responde "quanto eu tenho, onde está, o que aconteceu, o que vence e o que está atrasado".

- [ ] Saldo consolidado e contas por instituição
- [ ] Transações recentes
- [ ] Próximas obrigações e obrigações vencidas
- [ ] Instituições conectadas e alertas de conexão
- [ ] Apache ECharts só se um gráfico realmente facilitar a leitura (ex.: evolução do saldo); nada de gráficos só porque a biblioteca existe

### Fase 7 — Iniciação de pagamentos

**Objetivo:** permitir pagar uma obrigação elegível a partir de uma conta escolhida pelo usuário, **sem o PrismaFi ter a custódia dos recursos**.\
**Entrega conjunta:** o usuário inicia um pagamento, autoriza no banco e acompanha o resultado no PrismaFi.

Fluxo da experiência:

```text
Obrigação → Pagar → Selecionar conta de origem → Revisar pagamento → Iniciar
→ Autorização externa (banco) → Processando → Resultado
```

- [ ] Seleção de conta de origem, mostrando só as contas elegíveis
- [ ] Tela de revisão: valor, destinatário, conta de origem e aviso de que a autorização acontece no banco
- [ ] Botão de iniciar protegido contra clique duplo
- [ ] `Idempotency-Key` gerada uma vez por tentativa de pagamento (`crypto.randomUUID()`) ao abrir a revisão e vinculada ao conteúdo revisado (obrigação, conta de origem e valor); guardada em `sessionStorage` até uma resposta final e reutilizada em todo retry, reload ou reenvio. Se o usuário mudar o conteúdo, uma nova chave é gerada
- [ ] Respostas de idempotência do backend: 409 (mesma chave ainda em processamento) leva ao acompanhamento do status, nunca a uma mensagem de falha; 422 (mesma chave com conteúdo diferente) reinicia a revisão com uma nova chave
- [ ] Redirecionamento para autorização e tela de retorno
- [ ] Acompanhamento do status (polling ou atualização ao voltar para a tela)
- [ ] Estados visuais distintos para cada situação (tabela abaixo)
- [ ] Um timeout de requisição **nunca** é exibido como pagamento com falha: leva ao estado "em verificação"
- [ ] E2E do fluxo completo com o provedor simulado, incluindo timeout, retorno sem autorização e reload durante o envio (só um pagamento é criado)

Estados de pagamento na interface:

| Estado                 | O que o usuário vê                                            |
| ---------------------- | ------------------------------------------------------------- |
| Pendente               | Pagamento criado, ainda não enviado para autorização          |
| Aguardando autorização | Ação necessária no banco, com link para continuar             |
| Processando            | Autorizado, aguardando a liquidação                           |
| Concluído              | Confirmação, com a obrigação marcada como paga                |
| Falhou                 | Motivo compreensível e próximos passos                        |
| Cancelado / expirado   | Explicação e opção de começar de novo                         |
| Em verificação         | Resultado ainda não confirmado: **nunca** mostrado como falha |

### Fase 8 — Notificações e confiabilidade operacional

**Objetivo:** garantir que o usuário entenda os eventos financeiros importantes e que a plataforma se recupere de falhas.\
**Entrega conjunta:** avisos de vencimento, conexão expirada e resultado de pagamento; falhas de jobs visíveis e recuperáveis.

- [ ] Feedback contextual na própria tela (banners e alertas) para conexão expirada, obrigação vencida e pagamento exigindo atenção

Central de notificações só entra se o feedback contextual não for suficiente para o MVP; preferências de notificação são pós-MVP.

### Fase 9 — Hardening do MVP

**Objetivo:** estabilizar antes de declarar o MVP concluído.\
**Entrega conjunta:** revisão de segurança concluída, ambiente de produção pronto e caminhos críticos cobertos por testes.

- [ ] Revisão de acessibilidade (navegação por teclado, leitores de tela, contraste) em todos os fluxos
- [ ] Revisão de responsividade em mobile, tablet e desktop
- [ ] Revisão dos estados de carregamento, vazio e erro
- [ ] Casos de borda do pagamento (voltar do banco sem autorizar, aba fechada, sessão expirada no meio do fluxo)
- [ ] Testes em Chrome, Firefox e WebKit (projetos do Playwright): exige download dos navegadores no CI, e o `channel: 'chrome'` passa para o projeto do Chrome
- [ ] E2E dos caminhos críticos contra o backend real em staging
- [ ] Error tracking no frontend
- [ ] Build de produção servido na mesma origem da API (reverse proxy), com HTTPS e cabeçalhos de segurança; CSP com nonce (`ngCspNonce`) fornecido pelo reverse proxy, porque o Angular injeta `<style>` em runtime

### Fase 10 — Lançamento do MVP

**Objetivo:** validar a jornada principal com usuários reais.\
**Entrega conjunta:** a jornada da [Definição do MVP](#definição-do-mvp) funciona de forma confiável em produção.

- [ ] Jornada completa testada de ponta a ponta em produção
- [ ] Coleta de feedback dos primeiros usuários

### Pós-MVP

Fora do caminho crítico; reavaliar depois do lançamento:

- 2FA (TOTP) e passkeys / WebAuthn
- Boleto e outros meios de pagamento além do Pix
- Detecção automática de contas a pagar e de assinaturas
- Busca textual em transações
- Devolução / estorno de pagamentos Pix
- Seletor manual de tema e personalização avançada da interface
- Análises financeiras avançadas, gráficos detalhados e assistente com IA
- Investimentos, crédito e empréstimos
- Múltiplas moedas
- Contas empresariais e permissões de equipe
- Central de notificações completa e preferências personalizadas
- Aplicativos móveis nativos
