import { Component } from '@angular/core';
import { Reveal } from '../../reveal';

type Visual = 'overview' | 'cash-flow' | 'transactions' | 'goals';

const GOAL_TICKS = 48;
const GOAL_PROGRESS = 0.65;

@Component({
  selector: 'app-capabilities',
  imports: [Reveal],
  templateUrl: './capabilities.html',
  styleUrl: './capabilities.scss',
})
export class Capabilities {
  protected readonly capabilities: {
    visual: Visual;
    name: string;
    title: string;
    text: string;
  }[] = [
    {
      visual: 'overview',
      name: 'Unified overview',
      title: 'Your financial picture, in one place.',
      text: 'Bring balances, income, expenses and activity into a single structured view.',
    },
    {
      visual: 'cash-flow',
      name: 'Cash flow',
      title: "Know what comes in, what goes out, and what's left.",
      text: 'Understand the relationship between income, expenses and your monthly result without rebuilding spreadsheets every month.',
    },
    {
      visual: 'transactions',
      name: 'Transactions',
      title: 'Find the story behind every movement.',
      text: 'Organize financial activity so that recurring expenses, categories and unusual movements become easier to identify.',
    },
    {
      visual: 'goals',
      name: 'Goals',
      title: 'Turn financial intentions into visible progress.',
      text: 'Create goals, track progress and understand how everyday decisions affect what you are trying to achieve.',
    },
  ];

  protected readonly rawTransactions = [
    'PIX 0923 ANA S',
    'NETFLIX.COM',
    'CEMIG*FAT 09',
    'SPOTIFY P1A2',
  ];
  protected readonly categories = [
    { name: 'Subscriptions', count: '2 recurring' },
    { name: 'Utilities', count: '1 bill' },
    { name: 'Transfers', count: '1 outgoing' },
  ];

  // A ring of evenly spaced ticks; the first 65% are lit.
  protected readonly goalTicks = Array.from({ length: GOAL_TICKS }, (_, i) => {
    const angle = (i / GOAL_TICKS) * 2 * Math.PI - Math.PI / 2;
    return {
      x1: 60 + Math.cos(angle) * 44,
      y1: 60 + Math.sin(angle) * 44,
      x2: 60 + Math.cos(angle) * 52,
      y2: 60 + Math.sin(angle) * 52,
      done: i < GOAL_TICKS * GOAL_PROGRESS,
    };
  });
}
