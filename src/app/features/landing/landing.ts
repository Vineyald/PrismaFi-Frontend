import { Component } from '@angular/core';
import { Capabilities } from './components/capabilities/capabilities';
import { FinalCta } from './components/final-cta/final-cta';
import { Fragmentation } from './components/fragmentation/fragmentation';
import { Hero } from './components/hero/hero';
import { HowItWorks } from './components/how-it-works/how-it-works';
import { Intelligence } from './components/intelligence/intelligence';
import { PrismaPrinciple } from './components/prisma-principle/prisma-principle';
import { ProductPreview } from './components/product-preview/product-preview';
import { Roadmap } from './components/roadmap/roadmap';
import { Security } from './components/security/security';

/**
 * Public landing page. The narrative follows the prism: financial noise, PrismaFi,
 * organization, understanding, action.
 */
@Component({
  selector: 'app-landing',
  imports: [
    Hero,
    Fragmentation,
    PrismaPrinciple,
    ProductPreview,
    Capabilities,
    Intelligence,
    HowItWorks,
    Security,
    Roadmap,
    FinalCta,
  ],
  template: `
    <app-hero />
    <app-fragmentation />
    <app-prisma-principle />
    <app-product-preview />
    <app-capabilities />
    <app-intelligence />
    <app-how-it-works />
    <app-security />
    <app-roadmap />
    <app-final-cta />
  `,
  styles: `
    :host {
      flex: 1;
      display: block;
    }
  `,
})
export class Landing {}
