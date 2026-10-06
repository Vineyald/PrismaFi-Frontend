import { Component } from '@angular/core';
import { Reveal } from '../../reveal';

@Component({
  selector: 'app-security',
  imports: [Reveal],
  templateUrl: './security.html',
  styleUrl: './security.scss',
})
export class Security {
  protected readonly principles = [
    {
      name: 'Secure authentication',
      text: 'Identity and authentication designed around secure defaults.',
    },
    {
      name: 'Session control',
      text: 'The foundation for visibility and control over active sessions.',
    },
    {
      name: 'Privacy by design',
      text: 'Financial information should be collected and processed only where it serves a clear product purpose.',
    },
    {
      name: 'Clear boundaries',
      text: 'PrismaFi should tell users what it can access, what it stores and why.',
    },
  ];
}
