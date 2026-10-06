import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="shell-header">
      <a class="brand" routerLink="/">
        <span class="brand-mark" aria-hidden="true"></span>
        PrismaFi
      </a>
    </header>
    <main class="shell-main">
      <router-outlet />
    </main>
  `,
  styleUrl: './app.scss',
})
export class App {}
