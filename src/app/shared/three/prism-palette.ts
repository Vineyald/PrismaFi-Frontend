/**
 * Colors for prism scenes, mirroring the design tokens in styles/abstracts/_colors.scss
 * (WebGL needs numbers, not CSS variables). See docs/design-system.md, "Linguagem visual do
 * prisma": dark glass, thin light edges, violet key light, cyan rim light, no rainbow.
 */
export const PRISM_PALETTE = {
  background: 0x08090d, // $neutral-950
  glass: 0x12151c, // $neutral-850
  edge: 0xf5f6f9, // $neutral-50
  keyLight: 0x7c5cff, // $violet-400
  rimLight: 0x38bdf8, // $cyan-400
} as const;
