import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../../reveal';
import { GoalRing } from './goal-ring';

@Component({
  selector: 'app-capabilities',
  imports: [RouterLink, Reveal, GoalRing],
  templateUrl: './capabilities.html',
  styleUrl: './capabilities.scss',
})
export class Capabilities {}
