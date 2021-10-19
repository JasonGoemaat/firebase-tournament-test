import { Component, ComponentFactoryResolver, Input, OnInit } from '@angular/core';
import { data, Tournament } from '../models/tournament';
import { TournamentConfig, BorderConfig, TournamentSpotConfig } from '../models/tournament-config';
import { TournamentViewModel } from '../models/tournament-view-model';

@Component({
  selector: 'app-tournament-view',
  templateUrl: './tournament-view.component.html',
  styleUrls: ['./tournament-view.component.scss']
})
export class TournamentViewComponent implements OnInit {
  @Input() config: TournamentConfig | null = null;
  @Input() tournament: Tournament | null = null;
  vm: TournamentViewModel | null = null;
  BorderConfig = BorderConfig;
  data = data;

  constructor() { }

  ngOnInit(): void {
    console.log('TournamentViewComponent config:', this.config);
    console.log('TournamentViewComponent tournament:', this.tournament);
    if (this.config != null && this.tournament != null) {
      this.vm = new TournamentViewModel(this.config, this.tournament);
      console.log('vm:', this.vm);
    }
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

  getSpotDisplayInfo(spot: TournamentSpotConfig) {
    // need 'isWinner' or 'isLoser' to add class to element
    // need displayText (name (i.e. 'Jeff Livingston'), time (i.e. '9:00 am'), source (i.e. loser of WA'))
    // need isItalic (if not name like 'Jeff Livingston' (i.e. for time or source, or place ))
    // hintText (if is where winner goes, display game name)

    const infos: any[] = [];

    if (this.config != null) {
      this.config.spots.forEach((spot, spotIndex) => {
        // 
      })
    }
  }
}
