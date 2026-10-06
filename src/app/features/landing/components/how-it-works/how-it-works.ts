import { Component } from '@angular/core';
import { Reveal } from '../../reveal';

@Component({
  selector: 'app-how-it-works',
  imports: [Reveal],
  template: `
    <section class="steps" id="how-it-works" aria-labelledby="steps-title">
      <div class="steps__inner container">
        <div class="steps__copy" appReveal>
          <p class="steps__eyebrow">From data to decisions</p>
          <h2 class="steps__title" id="steps-title">A clearer financial routine in three steps.</h2>
        </div>

        <!-- One continuous line runs through all three steps. -->
        <ol class="steps__list" appReveal>
          @for (step of steps; track step.number) {
            <li class="steps__step">
              <span class="steps__number" aria-hidden="true">{{ step.number }}</span>
              <h3 class="steps__name">{{ step.name }}</h3>
              <p class="steps__text">{{ step.text }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styleUrl: './how-it-works.scss',
})
export class HowItWorks {
  protected readonly steps = [
    {
      number: '01',
      name: 'Bring it together',
      text: 'Add and organize your financial information in PrismaFi.',
    },
    {
      number: '02',
      name: 'See the structure',
      text: 'PrismaFi turns activity into balances, categories, cash flow and trends.',
    },
    {
      number: '03',
      name: 'Understand what matters',
      text: 'Use the bigger picture to make more informed financial decisions.',
    },
  ];
}
