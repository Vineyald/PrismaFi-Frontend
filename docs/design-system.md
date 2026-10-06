# Design system do PrismaFi

Referência visual e técnica do frontend. Toda tela nova segue este documento; quando uma decisão aqui não servir mais, mude o documento junto com o código.

## Conceito

Um prisma pega luz branca, complexa, e revela sua estrutura interna em raios precisos. O PrismaFi faz o mesmo com a vida financeira: **informação complexa entra, clareza sai.**

A identidade traduz isso em:

- **Escuro e neutro** como base: preto, grafite, cinza. Silêncio visual para os números falarem.
- **Luz rara e controlada**: um violeta elétrico e um ciano elétrico, como os dois raios que saem do prisma da marca. Nunca um arco-íris.
- **Geometria precisa**: linhas finas, raios pequenos, grades técnicas, bordas que "pegam luz".
- **Profundidade por contraste**, não por brilho: superfícies, bordas e sombras discretas.

A marca (`app.ts`) é esse conceito em 24px: um feixe cinza entra num prisma de traço fino e sai como um raio violeta e um ciano.

## Cores

Distribuição alvo: **70–80%** escuros neutros, **15–20%** tipografia clara, **5–10%** acento.

### Paleta (`abstracts/_colors.scss`)

| Token                                    | Hex                               | Uso                                                                  |
| ---------------------------------------- | --------------------------------- | -------------------------------------------------------------------- |
| `$neutral-950`                           | `#08090d`                         | Fundo da página                                                      |
| `$neutral-900`                           | `#0d0f14`                         | Fundo secundário, campos                                             |
| `$neutral-850`                           | `#12151c`                         | Superfícies (cards)                                                  |
| `$neutral-800`                           | `#181c25`                         | Superfícies aninhadas                                                |
| `$neutral-750` / `700`                   | `#1f2430` / `#2a303d`             | Bordas sutil / padrão (divisões, superfícies)                        |
| `$neutral-500`                           | `#5c6577`                         | Borda forte: contorno de controles (3,3:1 sobre campos, WCAG 1.4.11) |
| `$neutral-400`                           | `#8790a2`                         | Texto apagado (6,2:1)                                                |
| `$neutral-300`                           | `#b3bac8`                         | Texto secundário (10,2:1)                                            |
| `$neutral-50`                            | `#f5f6f9`                         | Texto principal (18,4:1)                                             |
| `$violet-500`                            | `#7655ff`                         | Preenchimento da ação primária (rótulo branco 4,65:1)                |
| `$violet-600` / `700`                    | `#6a48f5` / `#5f3fe6`             | Hover / active da ação primária                                      |
| `$violet-400`                            | `#7c5cff`                         | Violeta da marca: luz, decoração, cenas 3D                           |
| `$violet-300`                            | `#ae9bff`                         | Texto violeta e foco sobre escuro (8,5:1)                            |
| `$cyan-400`                              | `#38bdf8`                         | Acento secundário (9,3:1)                                            |
| `$green-400` / `$amber-400` / `$red-400` | `#3dd68c` / `#f5b544` / `#ff6b70` | Sucesso / atenção / erro                                             |

Contrastes medidos (WCAG) contra `#08090d`. O violeta de referência `#7c5cff` com texto branco dá 4,35:1, abaixo de 4,5:1: por isso botões usam `#7655ff`, e `#7c5cff` fica para luz e decoração.

### Tokens semânticos

Componentes usam **só** tokens semânticos, nunca a paleta nem hex soltos. Cada token resolve para uma CSS custom property (definida em `base/_root.scss`), então um tema futuro só redefine as propriedades.

| SCSS                                                           | CSS custom property                                                           |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `$color-background-primary` / `-secondary` / `-elevated`       | `--prisma-background` / `-background-secondary` / `-background-elevated`      |
| `$color-surface-primary` / `-secondary`                        | `--prisma-surface` / `-surface-secondary`                                     |
| `$color-border-subtle` / `-default` / `-strong`                | `--prisma-border-subtle` / `--prisma-border` / `--prisma-border-strong`       |
| `$color-text-primary` / `-secondary` / `-muted` / `-on-accent` | `--prisma-text` / `-text-secondary` / `--prisma-muted` / `--prisma-on-accent` |
| `$color-accent-primary` (+ `-hover`, `-active`, `-text`)       | `--prisma-accent` (+ `-hover`, `-active`, `-text`)                            |
| `$color-accent-secondary`                                      | `--prisma-accent-secondary`                                                   |
| `$color-focus`                                                 | `--prisma-focus`                                                              |
| `$color-success` / `-warning` / `-error` / `-info`             | `--prisma-success` / `-warning` / `-error` / `-info`                          |

### Onde o acento entra

Ação primária (uma por tela), foco, estado ativo/selecionado, links, um dado financeiro em destaque, luz do prisma. **Não** em todo botão, ícone ou borda: o acento vale porque é raro.

### Gradientes

Permitidos só com propósito: luz atmosférica sutil (`backdrop-glow`), refração do prisma, materiais 3D, pequenos destaques. **Proibidos**: fundo de toda seção, cards com gradiente, botões com gradiente, arco-íris, glassmorphism pesado, neon.

## Tipografia

**Inter** (variável, `@fontsource-variable/inter`, auto-hospedada: sem requisição a terceiros). Neutra, técnica e feita para números de interface. Uma família só.

| Estilo    | Tamanho                   | Altura | Peso | Uso                                                     |
| --------- | ------------------------- | ------ | ---- | ------------------------------------------------------- |
| `display` | `clamp(2.75rem → 5.5rem)` | 1.02   | 600  | Hero, número-chave                                      |
| `h1`      | `clamp(2.25rem → 3.5rem)` | 1.08   | 600  | Título de página                                        |
| `h2`      | `clamp(1.75rem → 2.5rem)` | 1.15   | 600  | Seção, valor de métrica                                 |
| `h3`      | `1.5rem`                  | 1.25   | 600  | Card, título de formulário                              |
| `h4`      | `1.25rem`                 | 1.3    | 600  | Subtítulo, marca                                        |
| `body-lg` | `1.125rem`                | 1.6    | 400  | Texto de abertura                                       |
| `body`    | `1rem`                    | 1.6    | 400  | Texto padrão                                            |
| `body-sm` | `0.875rem`                | 1.5    | 400  | Apoio, dicas, alertas                                   |
| `label`   | `0.875rem`                | 1.4    | 500  | Rótulos, botões                                         |
| `caption` | `0.75rem`                 | 1.4    | 500  | Legendas, eyebrows (em maiúsculas com `letter-spacing`) |

Títulos grandes usam `letter-spacing` negativo (de `-0.04em` a `-0.01em`), como na geometria compacta das referências.

```scss
.card__title {
  @include text-style(h3);
}
```

### Números financeiros

`@include numeric` (ou a classe `.numeric`) ativa algarismos tabulares e alinhados (`tnum`, `lnum`): colunas não "dançam" quando os valores mudam.

```html
<p class="metric">
  <span class="metric__label">Saldo total</span>
  <span class="metric__value">R$ 12.450,00</span>
  <span class="metric__delta metric__delta--positive">+8,42%</span>
</p>
```

Positivo, negativo e neutro **nunca** dependem só de cor: o valor mantém o sinal (`+`/`−`) e os modificadores `--positive`/`--negative` acrescentam uma seta (oculta para leitores de tela, que leem o sinal).

## Espaçamento

Grade de 4px: `$space-1` (4px), `2` (8), `3` (12), `4` (16), `5` (20), `6` (24), `8` (32), `10` (40), `12` (48), `16` (64), `24` (96).

- `$space-section`: ritmo entre seções, `clamp(4rem → 10rem)`.
- `$space-gutter`: margem lateral da página, `clamp(1rem → 3rem)`.
- `$control-height` (44px) e `$control-height-sm` (36px): botões e campos alinham; 44px atende o alvo de toque.

Valores fora da escala só com motivo real (ex.: alinhar um ícone a uma linha de texto).

## Raios

Preciso, não "almofadado": `$radius-xs` 2px, `$radius-sm` 6px (botões, campos, alertas), `$radius-md` 10px (cards), `$radius-lg` 16px (painéis grandes, molduras de mídia), `$radius-full` só para o que é semanticamente redondo (chips de status, avatares).

## Elevação

No escuro, separação vem de **contraste de superfície e borda**; sombra só aprofunda.

- `$shadow-highlight`: brilho de 1px no topo, como luz numa aresta usinada.
- `$shadow-sm` / `$shadow-md` / `$shadow-lg`: sombras escuras e difusas.
- `$glow-accent`: brilho violeta, **só** em visuais decorativos (hero), nunca em UI de rotina.

Superfícies: `@include surface` (cards) ou `surface(secondary)` (painéis aninhados): fundo escuro, borda fina, raio moderado, sombra contida. Transparência só onde a superfície encosta numa cena 3D.

## BEM

Obrigatório para classes de componentes: `.bloco`, `.bloco__elemento`, `.bloco--modificador`, `.bloco__elemento--modificador`. Estado também é modificador (`.button--loading`, `.form-field--invalid`).

```html
<section class="auth-card">
  <header class="auth-card__header">
    <h1 class="auth-card__title">Sign in</h1>
  </header>
  <form class="auth-card__form">…</form>
</section>
```

```scss
.auth-card {
  @include surface;

  &__header { … }
  &__title { @include text-style(h3); }
  &--compact { … }
}
```

Regras:

- Aninhamento raso: `&__elemento` e `&--modificador`; descendentes só no padrão `&--mod &__elemento`. Nunca seletores presos à estrutura do DOM (`.page div form input`).
- Um bloco por componente. Em `shared/ui/` o bloco tem o nome do componente (`button`, `form-field`, `inline-alert`) e o componente usa `ViewEncapsulation.None`: o nome do bloco já isola o CSS, e as classes ficam no próprio host (`<button class="button button--primary">`).
- Páginas e features usam o encapsulamento padrão do Angular, com blocos próprios (`auth-page`, `auth-card`, `home`, `api-status`).
- Atributos ARIA continuam sendo a fonte de verdade para acessibilidade (`aria-invalid`, `aria-disabled`); o modificador BEM é só para estilo.

## Componentes base (`shared/ui/`)

| Bloco                                            | Variantes / estados                                                                                                                                                                                                |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `button` (`button[app-button]`, `a[app-button]`) | `--primary` (padrão), `--secondary`, `--ghost`; `--small`; `--loading` (só em `<button>`: spinner, `aria-disabled`, bloqueia o envio do formulário; handlers `(click)` próprios precisam se proteger); `:disabled` |
| `form-field`                                     | `--invalid`, `--disabled`; elementos `__label`, `__required`, `__input`, `__hint`, `__error`                                                                                                                       |
| `inline-alert`                                   | `--error` (`role="alert"`), `--warning`, `--info` (`role="status"`); ícone de formato distinto por variante                                                                                                        |

Estados interativos: default, hover, active, foco visível, disabled, loading e erro. Variante `danger` só entra quando existir uma ação destrutiva real.

## Movimento

| Token              | Valor                           | Uso                                    |
| ------------------ | ------------------------------- | -------------------------------------- |
| `$duration-fast`   | 120ms                           | Hover, pressionar                      |
| `$duration-normal` | 200ms                           | Mudança de estado, revelações pequenas |
| `$duration-slow`   | 360ms                           | Painéis, transições de página          |
| `$duration-slower` | 700ms                           | Revelação de seções grandes            |
| `$ease-standard`   | `cubic-bezier(0.2, 0, 0, 1)`    | Maioria das transições                 |
| `$ease-enter`      | `cubic-bezier(0.16, 1, 0.3, 1)` | Elementos chegando                     |
| `$ease-exit`       | `cubic-bezier(0.4, 0, 1, 1)`    | Elementos saindo                       |

`@include transition(prop1, prop2)` aplica duração e curva padrão. Sem bounce, sem elástico: movimento é feedback e hierarquia, não enfeite.

**Rolagem suave**: CSS nativo (`scroll-behavior: smooth`), só com `prefers-reduced-motion: no-preference`; `scroll-padding-top` reserva espaço para um header fixo. Sem biblioteca de smooth scroll.

**Movimento reduzido**: com `prefers-reduced-motion: reduce`, transições e animações CSS terminam na hora (`base/_accessibility.scss`) e cenas 3D renderizam um quadro estático.

**Entrada ao rolar**: a diretiva `appReveal` (`features/landing/reveal.ts`) aplica a classe global `.reveal` (opacidade 0 e 20px abaixo) e, na primeira vez que o elemento entra na viewport, `.reveal--visible`, com `$duration-slower` e `$ease-enter`. Um `IntersectionObserver` por elemento, desligado depois de disparar; nada de listener de scroll. Use em blocos (cabeçalho de seção, um visual), não em cada parágrafo. Com movimento reduzido, só a opacidade muda.

## Padrões de página (landing)

Cada seção é um componente com bloco BEM próprio (`hero`, `fragmentation`, `principle`, `product-preview`, `capability`, `intelligence`, `insight`, `steps`, `security`, `roadmap`, `final-cta`) e puxa a aparência comum dos mixins de `features/landing/_landing.scss`:

- `section`: espaçamento vertical `$space-section`.
- `eyebrow`: traço violeta curto + rótulo em maiúsculas, apagado. O acento fica no detalhe.
- `title` (h2, até ~20 caracteres por linha, `text-wrap: balance`) e `lead` (body-lg secundário).
- `sample-label`: rótulo discreto "sample data" em visualizações com dados de exemplo.

Regras de composição:

- Ritmo variado: texto | visual, visual | texto, painel centralizado, linha contínua de passos. Nunca uma sequência de grades de cards iguais.
- Fundos alternam entre `$color-background-primary` e `secondary`, com bordas sutis entre seções; no máximo uma luz (`backdrop-glow`) por seção.
- Visualizações de produto usam os mesmos tokens e componentes do app e trazem "sample data" visível: são demonstração, não dados do usuário.
- Funcionalidades futuras são descritas como futuras ("being built to", "designed to"); o roadmap mostra status em texto ("In progress", "Next", "Planned").
- Legendas de gráficos usam o bloco global `.legend` (`styles/utilities/_legend.scss`): o nome da série é sempre texto, a cor (via `--legend-swatch`) só apoia.

## Responsividade

Mobile-first, de **320px a 2560px**. `@include breakpoint(md)` ou `breakpoint($bp-md)`:

| Nome   | Largura | Alvo              |
| ------ | ------- | ----------------- |
| (base) | 320px+  | Celulares         |
| `sm`   | 640px   | Celulares grandes |
| `md`   | 768px   | Tablets           |
| `lg`   | 1024px  | Laptops           |
| `xl`   | 1280px  | Desktops          |
| `2xl`  | 1536px  | Desktops grandes  |

Tipografia grande e espaçamento de seção são fluidos (`clamp()`); controles têm tamanho fixo.

### Larguras de conteúdo

Classes globais, nunca `max-width` próprio por página:

- `.container`: 72rem (telas de produto)
- `.container--narrow`: 40rem (formulários, leitura)
- `.container--wide`: 90rem (seções de marketing, visuais grandes)

Todas incluem o `$space-gutter` lateral.

## Fundos

Mixins em `abstracts/_mixins.scss`, aplicados em pseudo-elementos atrás do conteúdo (`z-index: $z-background`). **No máximo dois por seção**, sempre subordinados ao conteúdo:

- `backdrop-grid($cell)`: grade técnica fina, que some nas bordas.
- `backdrop-glow($color, $position, $size)`: luz suave, violeta (padrão) ou ciano.
- `backdrop-noise($opacity)`: granulação quase invisível contra banding em gradientes grandes.

As telas de autenticação e a inicial usam grade + luz violeta vinda de cima.

## Iconografia

Traço simples e geométrico: **24×24, traço de 1.75px, cantos e pontas arredondados, sem preenchimento**, cor via `currentColor`. É o estilo do **Lucide**, que entra como dependência com o primeiro conjunto real de ícones (hoje há só os ícones de alerta, inline). Não misturar famílias.

## Linguagem visual do prisma (Three.js)

Para cenas 3D (hero da landing page e futuros visuais):

- **Forma**: prisma triangular, fragmentos geométricos flutuando, linhas de dados atravessando o prisma e saindo reorganizadas.
- **Material**: vidro escuro, transparente ou semitransparente, arestas finas e claras; refração sutil.
- **Luz**: violeta `#7c5cff` como luz principal, ciano `#38bdf8` como contraluz; o resto é escuridão. Sem arco-íris literal.
- **Movimento**: rotação lenta e contínua, deriva mínima. Com movimento reduzido, cena estática.
- **Composição**: o prisma é o único elemento luminoso da seção; texto sempre legível por cima ou ao lado, nunca disputando contraste.

A ideia guia: **infraestrutura financeira visualizada como geometria de precisão.** A identidade deve ser reconhecível mesmo sem o logotipo.

### Infraestrutura (`shared/three/`)

`<app-three-canvas [scene]="factory">` hospeda uma cena e cuida do ciclo de vida:

- Carrega o `three` por import dinâmico, só no navegador (`afterNextRender`), quando o canvas chega perto da viewport. Nada de Three.js no bundle inicial.
- Anima só enquanto visível (`IntersectionObserver`); fora da tela, para o loop.
- Com `prefers-reduced-motion: reduce`, renderiza um quadro estático (e reage se a preferência mudar).
- Acompanha o tamanho do elemento (`ResizeObserver`) e limita o device pixel ratio a 2.
- Ao destruir: para o loop, chama o `dispose` da cena, libera geometrias, materiais e texturas, o renderer e o contexto WebGL.
- Sem WebGL, se o chunk do `three` não carregar ou se a cena lançar erro, fica vazio com `data-state="unsupported"` (o contexto WebGL é liberado): dê ao host um fundo CSS de fallback (ex.: `backdrop-glow`).
- O canvas é decorativo (`aria-hidden`); o significado fica no conteúdo ao redor.

A cena é uma função que recebe o módulo `three` e devolve `{ scene, camera, update?, resize?, dispose? }` (`resize(width, height)` reenquadra a composição quando o canvas muda de proporção):

```ts
const heroPrism: ThreeSceneFactory = (three) => {
  const scene = new three.Scene();
  const camera = new three.PerspectiveCamera(35, 1, 0.1, 100);
  // ... geometria, materiais e luzes com PRISM_PALETTE
  return { scene, camera, update: (delta) => (prism.rotation.y += delta * 0.2) };
};
```

`PRISM_PALETTE` (`shared/three/prism-palette.ts`) espelha os tokens de cor em números para o WebGL. O host define o tamanho (`height`, `aspect-ratio` ou posição absoluta atrás do conteúdo, com `z-index: $z-background`).

### Cena do hero (`features/landing/three/hero-prism.scene.ts`)

Sinais dispersos entram pela esquerda, convergem num prisma de vidro escuro e saem pela direita como quatro raios calmos e igualmente espaçados (dois violeta, dois ciano), com pacotes de dados em ritmo regular. Os sinais são invisíveis longe do prisma e ganham nitidez ao se aproximar, para não competir com o título.

- Desktop (canvas ≥ 1024px, atrás do texto): o prisma fica na metade direita; telas mais quadradas afastam a câmera. Abaixo disso, o canvas fica sob o texto e o prisma centralizado.
- Telas < 768px usam a versão leve: menos sinais e material sem transmissão (sem a passada extra de refração).
- Ponteiro (só mouse/trackpad): leve inclinação do prisma e deslocamento mínimo da câmera. Toque não interage.
- Fallback: um SVG estático com a mesma história fica visível até a cena desenhar e permanece se não houver WebGL.
- Com movimento reduzido: um quadro estático, sem resposta ao ponteiro.

## Acessibilidade

- Contraste: texto comum ≥ 4,5:1, texto grande e componentes de UI ≥ 3:1 (valores medidos na tabela de cores). Cor de acento nunca é tomada como "legível" sem medir.
- Foco sempre visível: anel global `:focus-visible` de 2px em `$color-focus`; campos usam borda + anel próprios, com outline transparente para continuar visível em modo de alto contraste (forced colors). Nunca remover outline sem substituto.
- Contorno de controles (campos) ≥ 3:1 contra o fundo: `$color-border-strong`. Bordas sutil e padrão servem só para dividir superfícies.
- Estado nunca só por cor: alertas têm ícone de formato distinto e rótulo oculto; erros de campo têm ícone e texto; deltas financeiros têm sinal e seta.
- Alvos de toque ≥ 44px (`$control-height`); o tamanho pequeno (36px) só em barras de navegação.
- HTML semântico primeiro: `<button>`, `<a>`, `<label for>`, landmarks.
- `prefers-reduced-motion` respeitado em CSS e em JavaScript.

## Exemplos

**Certo**

```scss
.metric-card {
  @include surface;
  padding: $space-6;

  &__value {
    @include text-style(h2);
    @include numeric;
  }
}
```

**Errado**

```scss
.card {
  background: linear-gradient(135deg, #7c5cff, #38bdf8); // gradiente em card
  border-radius: 24px; // raio fora da escala
  padding: 13px 19px; // espaçamento arbitrário
  color: #9999aa; // hex solto, contraste não medido

  div > p span { … } // seletor preso ao DOM
}
```
