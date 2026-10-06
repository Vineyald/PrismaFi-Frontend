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

| Token                                    | Hex                               | Uso                                                   |
| ---------------------------------------- | --------------------------------- | ----------------------------------------------------- |
| `$neutral-950`                           | `#08090d`                         | Fundo da página                                       |
| `$neutral-900`                           | `#0d0f14`                         | Fundo secundário, campos                              |
| `$neutral-850`                           | `#12151c`                         | Superfícies (cards)                                   |
| `$neutral-800`                           | `#181c25`                         | Superfícies aninhadas                                 |
| `$neutral-750` / `700` / `600`           | `#1f2430` / `#2a303d` / `#3d4554` | Bordas sutil / padrão / forte                         |
| `$neutral-400`                           | `#8790a2`                         | Texto apagado (6,2:1)                                 |
| `$neutral-300`                           | `#b3bac8`                         | Texto secundário (10,2:1)                             |
| `$neutral-50`                            | `#f5f6f9`                         | Texto principal (18,4:1)                              |
| `$violet-500`                            | `#7655ff`                         | Preenchimento da ação primária (rótulo branco 4,65:1) |
| `$violet-600` / `700`                    | `#6a48f5` / `#5f3fe6`             | Hover / active da ação primária                       |
| `$violet-400`                            | `#7c5cff`                         | Violeta da marca: luz, decoração, cenas 3D            |
| `$violet-300`                            | `#ae9bff`                         | Texto violeta e foco sobre escuro (8,5:1)             |
| `$cyan-400`                              | `#38bdf8`                         | Acento secundário (9,3:1)                             |
| `$green-400` / `$amber-400` / `$red-400` | `#3dd68c` / `#f5b544` / `#ff6b70` | Sucesso / atenção / erro                              |

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

| Bloco                                            | Variantes / estados                                                                                                             |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `button` (`button[app-button]`, `a[app-button]`) | `--primary` (padrão), `--secondary`, `--ghost`; `--small`; `--loading` (spinner, `aria-disabled`, cancela cliques); `:disabled` |
| `form-field`                                     | `--invalid`, `--disabled`; elementos `__label`, `__required`, `__input`, `__hint`, `__error`                                    |
| `inline-alert`                                   | `--error` (`role="alert"`), `--warning`, `--info` (`role="status"`); ícone de formato distinto por variante                     |

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

## Acessibilidade

- Contraste: texto comum ≥ 4,5:1, texto grande e componentes de UI ≥ 3:1 (valores medidos na tabela de cores). Cor de acento nunca é tomada como "legível" sem medir.
- Foco sempre visível: anel global `:focus-visible` de 2px em `$color-focus`; campos usam borda + anel próprios. Nunca remover outline sem substituto.
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
