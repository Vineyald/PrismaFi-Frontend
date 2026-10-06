import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../../../../shared/ui/button/button';
import { Reveal } from '../../reveal';

@Component({
  selector: 'app-final-cta',
  imports: [RouterLink, Button, Reveal],
  template: `
    <section class="final-cta" aria-labelledby="final-cta-title">
      <div class="final-cta__inner container container--narrow" appReveal>
        <!-- The hero prism again, smaller and still. -->
        <svg class="final-cta__prism" viewBox="0 0 200 80" aria-hidden="true">
          <path class="final-cta__beam" d="M4 46 L80 42" />
          <path class="final-cta__shape" d="M100 10 L124 66 H76 Z" />
          <path class="final-cta__ray final-cta__ray--violet" d="M110 38 L196 30" />
          <path class="final-cta__ray final-cta__ray--cyan" d="M112 44 L196 52" />
        </svg>
        <h2 class="final-cta__title" id="final-cta-title">Bring your finances into focus.</h2>
        <p class="final-cta__text">
          PrismaFi is being built for people who want to understand their money without turning
          financial management into another job.
        </p>
        <div class="final-cta__actions">
          <a app-button routerLink="/register">Create your account</a>
          <a app-button variant="secondary" routerLink="/login">Sign in</a>
        </div>
        <p class="final-cta__note">Start with the foundation. Grow with PrismaFi.</p>
      </div>
    </section>
  `,
  styleUrl: './final-cta.scss',
})
export class FinalCta {}
