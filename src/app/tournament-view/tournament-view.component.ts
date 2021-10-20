import {Component,Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { data, Tournament } from '../models/tournament';
import { TournamentConfig, BorderConfig, TournamentSpotConfig } from '../models/tournament-config';
import { SpotViewModel, TournamentViewModel } from '../models/tournament-view-model';
import { SpotDialogData } from '../spot-dialog/spot-dialog-data';
import { SpotDialogComponent } from '../spot-dialog/spot-dialog.component';

@Component({
  selector: 'app-tournament-view',
  templateUrl: './tournament-view.component.html',
  styleUrls: ['./tournament-view.component.scss']
})
export class TournamentViewComponent implements OnInit {
  myConfig: TournamentConfig | null = null;
  myTournament: Tournament | null = null;

  @Input()
  set config(config: TournamentConfig) {
    this.myConfig = config;
    if (this.config !== null && this.myTournament !== null) {
      this.vm = new TournamentViewModel(this.myConfig, this.myTournament);
    }
  }

  @Input()
  set tournament(tournament: Tournament) {
    this.myTournament = tournament;
    if (this.myConfig !== null && this.myTournament !== null) {
      this.vm = new TournamentViewModel(this.myConfig, this.myTournament);
    }
  }
  vm: TournamentViewModel | null = null;
  BorderConfig = BorderConfig;
  data = data;

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log('TournamentViewComponent config:', this.config);
    console.log('TournamentViewComponent tournament:', this.tournament);
    if (this.config != null && this.tournament != null) {
      this.vm = new TournamentViewModel(this.config, this.tournament);
      (window as any).vm = this.vm;
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

  onSpotClick(spot: SpotViewModel) {
    console.log('click:', spot, this.vm);
    const dialogRef = this.dialog.open(SpotDialogComponent, {
      data: new SpotDialogData(this.vm as TournamentViewModel, spot)
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('SpotDialogComponent closed, result:', result);
    });
  }
}
