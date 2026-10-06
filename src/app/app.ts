import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Auth } from './core/auth/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="shell-header">
      <a class="brand" routerLink="/">
        <span class="brand-mark" aria-hidden="true"></span>
        PrismaFi
      </a>
      @if (!auth.isAuthenticated()) {
        <a class="shell-link" routerLink="/login">Sign in</a>
      }
    </header>
    <main class="shell-main">
      <router-outlet />
    </main>
  `,
  styleUrl: './app.scss',
})
export class App {
  protected readonly auth = inject(Auth);
}
