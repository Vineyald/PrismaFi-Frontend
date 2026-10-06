import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandMark } from '../brand-mark';

/** Public site footer. Links only to pages and sections that exist. */
@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, BrandMark],
  host: { class: 'site-footer' },
  template: `
    <div class="site-footer__inner container container--wide">
      <div class="site-footer__brand">
        <a class="site-footer__logo" routerLink="/">
          <app-brand-mark />
          PrismaFi
        </a>
        <p class="site-footer__tagline">Financial information, brought into focus.</p>
      </div>

      <nav class="site-footer__nav" aria-label="Footer">
        <div class="site-footer__group">
          <h2 class="site-footer__heading">Product</h2>
          <ul class="site-footer__links">
            <li><a class="site-footer__link" routerLink="/" fragment="product">Overview</a></li>
            <li>
              <a class="site-footer__link" routerLink="/" fragment="intelligence">Intelligence</a>
            </li>
            <li><a class="site-footer__link" routerLink="/" fragment="roadmap">Roadmap</a></li>
          </ul>
        </div>
        <div class="site-footer__group">
          <h2 class="site-footer__heading">Account</h2>
          <ul class="site-footer__links">
            <li><a class="site-footer__link" routerLink="/login">Sign in</a></li>
            <li><a class="site-footer__link" routerLink="/register">Create account</a></li>
          </ul>
        </div>
      </nav>

      <p class="site-footer__copyright">© 2026 PrismaFi</p>
    </div>
  `,
  styleUrl: './site-footer.scss',
})
export class SiteFooter {}
