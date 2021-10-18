import { Participant } from "./participant";

export interface Tournament {
  ownerUid: string | undefined;
  ownerName: string | undefined;
  name: string | undefined;
  participants: Participant[];
  isPublic: boolean;
  scheduleMinutes: number
}

export interface TournamentGame {
  winnerId?: number;
  loserId?: number;
  startTime: number;
  endTime: number;
  enterTime: number;
}

export interface TournamentSpot {
  playerId?: number;
  playerName?: string;
  isWinner?: boolean;
  isLoser?: boolean;
}

export type TournamentSpots = Record<number, TournamentSpot>;

export interface TournamentData {
  spots: TournamentSpots;
}