import { Component } from '@angular/core';
import { Reveal } from '../../reveal';
import { CashFlowChart } from './cash-flow-chart';

@Component({
  selector: 'app-product-preview',
  imports: [Reveal, CashFlowChart],
  templateUrl: './product-preview.html',
  styleUrl: './product-preview.scss',
})
export class ProductPreview {
  protected readonly navigation = ['Overview', 'Accounts', 'Transactions', 'Goals'];

  protected readonly metrics = [
    { label: 'Total balance', value: 'R$ 12.450,80', delta: '+8,42%' },
    { label: 'Income', value: 'R$ 5.820,00' },
    { label: 'Expenses', value: 'R$ 3.210,45' },
    { label: 'Monthly result', value: '+ R$ 2.609,55' },
  ];

  protected readonly activity = [
    { name: 'Salary', category: 'Income', amount: '+ R$ 4.000,00', incoming: true },
    { name: 'Electricity', category: 'Bills', amount: '− R$ 184,30', incoming: false },
    { name: 'Streaming', category: 'Subscriptions', amount: '− R$ 39,90', incoming: false },
    { name: 'Transfer', category: 'Transfers', amount: '− R$ 250,00', incoming: false },
  ];
}
