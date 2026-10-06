import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import type { components } from '../../core/api/schema';
import { Home } from './home';

const healthy = {
  status: 'healthy',
  service: 'prismafi-backend',
  checks: { database: 'ok', redis: 'ok' },
} satisfies components['schemas']['HealthResponse'];

const unhealthy = {
  status: 'unhealthy',
  service: 'prismafi-backend',
  checks: { database: 'unavailable', redis: 'ok' },
} satisfies components['schemas']['HealthResponse'];

const serviceUnavailable = { status: 503, statusText: 'Service Unavailable' };

describe('Home API status', () => {
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  function render() {
    const fixture = TestBed.createComponent(Home);
    TestBed.tick();
    const el = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      status: () => el.querySelector('[role=status]')?.textContent,
      retryButton: () => el.querySelector<HTMLButtonElement>('button.home__retry'),
    };
  }

  it('shows online when the backend is healthy', async () => {
    const { fixture, status, retryButton } = render();

    httpTesting.expectOne('/api/health').flush(healthy);
    await fixture.whenStable();

    expect(status()).toContain('API online');
    expect(retryButton()).toBeNull();
  });

  it('shows offline when a dependency is down (503), and recovers on retry', async () => {
    const { fixture, status, retryButton } = render();

    httpTesting.expectOne('/api/health').flush(unhealthy, serviceUnavailable);
    await fixture.whenStable();
    expect(status()).toContain('API offline');

    retryButton()?.click();
    TestBed.tick(); // not whenStable(): it would wait for the pending request
    // Button stays in the DOM while reloading so keyboard focus is not lost.
    expect(retryButton()?.getAttribute('aria-disabled')).toBe('true');

    httpTesting.expectOne('/api/health').flush(healthy);
    await fixture.whenStable();
    expect(status()).toContain('API online');
  });
});
