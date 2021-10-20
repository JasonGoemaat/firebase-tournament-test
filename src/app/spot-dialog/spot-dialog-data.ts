import { SpotViewModel, TournamentViewModel } from "../models/tournament-view-model";

export class SpotDialogData {
  constructor(
    public vm: TournamentViewModel,
    public spot: SpotViewModel
  ) {}
}
