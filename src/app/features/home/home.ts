import { httpResource } from '@angular/common/http';
import { Component, computed } from '@angular/core';
import type { components } from '../../core/api/schema';

type HealthResponse = components['schemas']['HealthResponse'];

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly health = httpResource<HealthResponse>(() => '/api/health');

  // 503 (a dependency down) and network errors both surface as an error: offline.
  protected readonly apiStatus = computed(() => {
    if (this.health.isLoading()) return 'checking';
    return this.health.hasValue() && this.health.value().status === 'healthy'
      ? 'online'
      : 'offline';
  });

  // The Retry button stays rendered (aria-disabled) while reloading, so it keeps keyboard focus.
  // After a successful retry it disappears and focus returns to <body>; role=status announces the result.
  protected readonly showRetry = computed(
    () => this.apiStatus() === 'offline' || this.health.status() === 'reloading',
  );

  protected retry(): void {
    if (!this.health.isLoading()) this.health.reload();
  }
}
