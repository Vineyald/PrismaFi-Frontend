import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe = vi.fn();
        disconnect = vi.fn();
      },
    );
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient()] });
  });

  afterEach(() => vi.unstubAllGlobals());

  async function render() {
    const fixture = TestBed.createComponent(SiteHeader);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      host,
      toggle: host.querySelector<HTMLButtonElement>('.site-header__toggle')!,
    };
  }

  it('links every landing section and the account pages', async () => {
    const { host } = await render();

    const links = [...host.querySelectorAll('a')].map((a) => [
      a.textContent?.trim(),
      a.getAttribute('href'),
    ]);
    expect(links).toEqual([
      ['PrismaFi', '/'],
      ['Product', '/#product'],
      ['Intelligence', '/#intelligence'],
      ['Security', '/#security'],
      ['Roadmap', '/#roadmap'],
      ['Sign in', '/login'],
      ['Create account', '/register'],
    ]);
  });

  it('toggles the mobile menu and reports it to assistive technology', async () => {
    const { fixture, host, toggle } = await render();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-controls')).toBe('site-menu');

    toggle.click();
    await fixture.whenStable();

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(host.classList).toContain('site-header--open');
  });

  it('closes on Escape and returns focus to the menu button', async () => {
    const { fixture, host, toggle } = await render();
    toggle.click();
    await fixture.whenStable();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();

    expect(host.classList).not.toContain('site-header--open');
    expect(document.activeElement).toBe(toggle);
  });

  it('closes when a section link is followed', async () => {
    const { fixture, host, toggle } = await render();
    toggle.click();
    await fixture.whenStable();

    host.querySelector<HTMLAnchorElement>('.site-header__link')!.click();
    await fixture.whenStable();

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });
});
