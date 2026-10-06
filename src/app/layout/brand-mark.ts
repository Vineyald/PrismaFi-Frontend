import { Component, ViewEncapsulation } from '@angular/core';

/** The PrismaFi mark: one beam in, two precise rays out. Decorative; pair it with the name. */
@Component({
  selector: 'app-brand-mark',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'brand-mark', 'aria-hidden': 'true' },
  template: `
    <svg class="brand-mark__svg" viewBox="0 0 28 24">
      <path class="brand-mark__beam" d="M1 14.5 10.2 12.6" />
      <path class="brand-mark__prism" d="M14 3 23 20H5Z" />
      <path class="brand-mark__ray brand-mark__ray--violet" d="M16.6 11.6 27 9.2" />
      <path class="brand-mark__ray brand-mark__ray--cyan" d="M17.2 13.2 27 15.4" />
    </svg>
  `,
  styles: `
    .brand-mark {
      display: inline-flex;
      flex: none;
    }

    .brand-mark__svg {
      width: 1.75rem;
      height: 1.5rem;
      fill: none;
      stroke-width: 1.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .brand-mark__beam {
      stroke: var(--prisma-muted);
    }

    .brand-mark__prism {
      stroke: var(--prisma-text);
    }

    .brand-mark__ray--violet {
      stroke: var(--prisma-accent-text);
    }

    .brand-mark__ray--cyan {
      stroke: var(--prisma-accent-secondary);
    }
  `,
})
export class BrandMark {}
