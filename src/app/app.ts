import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Auth } from './core/auth/auth';
import { Button } from './shared/ui/button/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Button],
  template: `
    <header class="app-header">
      <div class="app-header__inner container container--wide">
        <a class="app-header__brand" routerLink="/">
          <!-- One beam in, two precise rays out: complexity resolved into clarity. -->
          <svg class="app-header__mark" viewBox="0 0 28 24" aria-hidden="true">
            <path class="app-header__mark-beam" d="M1 14.5 10.2 12.6" />
            <path class="app-header__mark-prism" d="M14 3 23 20H5Z" />
            <path class="app-header__mark-ray app-header__mark-ray--violet" d="M16.6 11.6 27 9.2" />
            <path class="app-header__mark-ray app-header__mark-ray--cyan" d="M17.2 13.2 27 15.4" />
          </svg>
          PrismaFi
        </a>
        @if (!auth.isAuthenticated()) {
          <nav class="app-header__nav" aria-label="Account">
            <a app-button variant="ghost" size="small" routerLink="/login">Sign in</a>
            <a app-button size="small" class="app-header__cta" routerLink="/register">
              Create account
            </a>
          </nav>
        }
      </div>
    </header>
    <main class="app-main">
      <router-outlet />
    </main>
  `,
  styleUrl: './app.scss',
})
export class App {
  protected readonly auth = inject(Auth);
}
