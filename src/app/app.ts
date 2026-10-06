import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooter } from './layout/site-footer/site-footer';
import { SiteHeader } from './layout/site-header/site-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  template: `
    <a class="skip-link" href="#main" (click)="$event.preventDefault(); main.focus()">
      Skip to content
    </a>
    <app-site-header />
    <main #main class="app-main" id="main" tabindex="-1">
      <router-outlet />
    </main>
    <app-site-footer />
  `,
  styleUrl: './app.scss',
})
export class App {}
