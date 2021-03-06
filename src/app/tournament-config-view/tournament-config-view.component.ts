import { Component, Input, OnInit } from '@angular/core';
import { BorderConfig, TournamentConfig, TournamentSpotConfig } from '../models/tournament-config';

@Component({
  selector: 'app-tournament-config-view',
  templateUrl: './tournament-config-view.component.html',
  styleUrls: ['./tournament-config-view.component.scss']
})
export class TournamentConfigViewComponent implements OnInit {
  @Input() config: TournamentConfig | null = null;
  BorderConfig = BorderConfig;

  constructor() { }

  ngOnInit(): void {
  }

  getBorderBottom(spot: TournamentSpotConfig): string {
    if (spot.borders === BorderConfig.Bottom || spot.borders == BorderConfig.BottomRight) {
      return 'solid 1px black';
    }
    if (spot.borders === BorderConfig.DashedBottom || spot.borders == BorderConfig.DashedBottomRight) {
      return 'dashed 1px black';
    }
    return '';
  }

  getBorderRight(spot: TournamentSpotConfig): string {
    if (spot.borders === BorderConfig.BottomRight) {
      return 'solid 1px black';
    }
    if (spot.borders === BorderConfig.DashedBottomRight) {
      return 'dashed 1px black';
    }
    return '';
  }

  getGameString(index: number): string | null{
    if (!this.config) return null;

    const config = this.config as TournamentConfig;
    for (let i = 0; i < config.games.length; i++) {
      const game = config.games[i];
      if (game.spotA == index) {
        return `A${i}`;
      }
      if (game.spotB == index) {
        return `B${i}`;
      }
    }
    return null;
  }
}
