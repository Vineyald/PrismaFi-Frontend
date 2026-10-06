import { Component } from '@angular/core';
import { Reveal } from '../../reveal';

@Component({
  selector: 'app-roadmap',
  imports: [Reveal],
  template: `
    <section class="roadmap" id="roadmap" aria-labelledby="roadmap-title">
      <div class="roadmap__inner container">
        <div class="roadmap__copy" appReveal>
          <p class="roadmap__eyebrow">What we're building</p>
          <h2 class="roadmap__title" id="roadmap-title">
            The foundation first. Intelligence next.
          </h2>
          <p class="roadmap__text">
            PrismaFi is actively being built, in this order. No dates, only direction.
          </p>
        </div>

        <ol class="roadmap__stages" appReveal>
          @for (stage of stages; track stage.name; let first = $first) {
            <li class="roadmap__stage" [class.roadmap__stage--active]="first">
              <span class="roadmap__status">{{ stage.status }}</span>
              <h3 class="roadmap__name">{{ stage.name }}</h3>
              <ul class="roadmap__items">
                @for (item of stage.items; track item) {
                  <li class="roadmap__item">{{ item }}</li>
                }
              </ul>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styleUrl: './roadmap.scss',
})
export class Roadmap {
  protected readonly stages = [
    {
      name: 'Foundation',
      status: 'In progress',
      items: ['Secure account access', 'Profile', 'Session management', 'Financial workspace'],
    },
    {
      name: 'Financial organization',
      status: 'Next',
      items: [
        'Accounts',
        'Transactions',
        'Categories',
        'Income and expenses',
        'Cash-flow overview',
      ],
    },
    {
      name: 'Financial planning',
      status: 'Planned',
      items: ['Goals', 'Recurring expenses', 'Upcoming obligations', 'Monthly planning'],
    },
    {
      name: 'Intelligence',
      status: 'Planned',
      items: ['Spending patterns', 'Financial trends', 'Relevant alerts', 'Contextual insights'],
    },
  ];
}
