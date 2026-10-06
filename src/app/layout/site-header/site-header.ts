import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ViewportScroller } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { Auth } from '../../core/auth/auth';
import { Button } from '../../shared/ui/button/button';
import { BrandMark } from '../brand-mark';

/** Sections of the landing page, reachable from every public page as `/#fragment`. */
export const LANDING_SECTIONS = [
  { fragment: 'product', label: 'Product' },
  { fragment: 'intelligence', label: 'Intelligence' },
  { fragment: 'security', label: 'Security' },
  { fragment: 'roadmap', label: 'Roadmap' },
] as const;

/**
 * Public site header: sticky, transparent at the top of the page and solid once the page
 * scrolls. Below the `lg` breakpoint the navigation collapses into a disclosure menu
 * (button with aria-expanded; Escape closes it and returns focus to the button).
 */
@Component({
  selector: 'app-site-header',
  imports: [RouterLink, Button, BrandMark],
  host: {
    class: 'site-header',
    '[class.site-header--scrolled]': 'scrolled()',
    '[class.site-header--open]': 'menuOpen()',
    '(document:keydown.escape)': 'closeMenu(true)',
  },
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  protected readonly auth = inject(Auth);
  protected readonly sections = LANDING_SECTIONS;
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);

  private readonly toggle = viewChild.required<ElementRef<HTMLButtonElement>>('toggle');

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOpen.set(false));

    // Anchor links (/#section) scroll with JavaScript, which ignores CSS scroll-padding:
    // land sections below this sticky header instead of under it.
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    inject(ViewportScroller).setOffset(() => [0, host.offsetHeight + 16]);

    // A 1px marker at the top of the page: once it leaves the viewport, the page has scrolled.
    // Cheaper than a scroll listener, and fires only when the state flips.
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const marker = document.createElement('div');
      marker.setAttribute('aria-hidden', 'true');
      marker.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:8px;';
      document.body.prepend(marker);
      const observer = new IntersectionObserver(([entry]) =>
        this.scrolled.set(!entry.isIntersecting),
      );
      observer.observe(marker);
      destroyRef.onDestroy(() => {
        observer.disconnect();
        marker.remove();
      });
    });
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(restoreFocus = false): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    if (restoreFocus) this.toggle().nativeElement.focus();
  }
}
