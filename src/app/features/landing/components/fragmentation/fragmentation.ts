import { Component } from '@angular/core';
import { Reveal } from '../../reveal';

interface Fragment {
  label: string;
  detail: string;
  /** Position in the scattered field (desktop), percent of width and height. */
  x: number;
  y: number;
}

@Component({
  selector: 'app-fragmentation',
  imports: [Reveal],
  templateUrl: './fragmentation.html',
  styleUrl: './fragmentation.scss',
})
export class Fragmentation {
  protected readonly fragments: Fragment[] = [
    { label: 'Checking account', detail: 'R$ 2.340,18', x: 6, y: 10 },
    { label: 'Credit card', detail: '− R$ 1.219,40', x: 54, y: 2 },
    { label: 'Subscriptions', detail: '6 active', x: 30, y: 38 },
    { label: 'Bills', detail: '3 due this month', x: 70, y: 46 },
    { label: 'Income', detail: '+ R$ 4.000,00', x: 2, y: 72 },
    { label: 'Transfers', detail: '12 this month', x: 46, y: 80 },
  ];
}
