import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooter } from './layout/site-footer/site-footer';
import { SiteHeader } from './layout/site-header/site-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  template: `
    <app-site-header />
    <main class="app-main" id="main">
      <router-outlet />
    </main>
    <app-site-footer />
  `,
  styleUrl: './app.scss',
})
export class App {}
