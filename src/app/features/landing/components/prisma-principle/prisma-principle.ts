import { Component } from '@angular/core';
import { Reveal } from '../../reveal';

@Component({
  selector: 'app-prisma-principle',
  imports: [Reveal],
  templateUrl: './prisma-principle.html',
  styleUrl: './prisma-principle.scss',
})
export class PrismaPrinciple {
  protected readonly inputs = ['Accounts', 'Transactions', 'Bills', 'Income'];
  protected readonly outputs = ['Overview', 'Cash flow', 'Insights', 'Goals'];
}
