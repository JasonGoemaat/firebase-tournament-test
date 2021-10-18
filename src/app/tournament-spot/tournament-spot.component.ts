import { Component, Input, OnInit } from '@angular/core';
import { TournamentData } from '../models/tournament';
import { TournamentConfig } from '../models/tournament-config';

@Component({
  selector: 'app-tournament-spot',
  templateUrl: './tournament-spot.component.html',
  styleUrls: ['./tournament-spot.component.scss']
})
export class TournamentSpotComponent implements OnInit {
  @Input() config: TournamentConfig | null = null;
  @Input() data: TournamentData | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
