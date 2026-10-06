import { Component } from '@angular/core';
import { Reveal } from '../../reveal';

// Sample series for the example insight (BRL). 735 vs. the Jun–Aug average (656.33) is +12%;
// 735 vs. June (620) is +18.5%.
const RECURRING = [
  { month: 'Jun', amount: 620 },
  { month: 'Jul', amount: 648 },
  { month: 'Aug', amount: 701 },
  { month: 'Sep', amount: 735 },
];
const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

@Component({
  selector: 'app-intelligence',
  imports: [Reveal],
  templateUrl: './intelligence.html',
  styleUrl: './intelligence.scss',
})
export class Intelligence {
  protected readonly signals = [
    { name: 'Spending patterns', text: 'Understand where spending is increasing or decreasing.' },
    {
      name: 'Recurring expenses',
      text: 'Identify subscriptions and repeated charges more easily.',
    },
    { name: 'Cash-flow trends', text: 'See how your financial balance evolves over time.' },
    {
      name: 'Relevant signals',
      text: 'Surface changes that deserve attention instead of making you inspect every transaction manually.',
    },
  ];

  private readonly max = Math.max(...RECURRING.map((entry) => entry.amount));
  protected readonly recurring = RECURRING.map((entry) => ({
    month: entry.month,
    amount: brl.format(entry.amount),
    share: entry.amount / this.max,
  }));
}
