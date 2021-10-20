export interface Participant {
  name: string;
  id: number;
  seed: number | undefined;
  uid: string | null;
}

export type ParticipantMap = Record<number, number>

export interface Tournament {
  ownerUid: string | undefined;
  ownerName: string | undefined;
  name: string | undefined;
  participants: Participant[];
  isPublic: boolean;
  scheduleMinutes: number;
  timeSlots: TimeSlot[];
  participantMap: ParticipantMap;
  gameMap: GameMap;
}

export interface Game {
  matchWinner?: number;
  matchLoser?: number;
  winners?: [];
  startTime?: number;
  endTime?: number;
  enterTime?: number;
}

// Tournament.games is GameMap, game is only added when it is scored
export type GameMap = Record<number, Game>

export interface TournamentSpot {
  playerId?: number;
  isWinner?: boolean;
  isLoser?: boolean;
  isBye?: boolean;
  displayTime?: string;
  displayName?: string;
  className?: string;
}

export interface TimeSlot {
  utc: number;
  gameId: number;
}

export type TournamentSpots = Record<number, TournamentSpot>;

export interface TournamentData {
  spots: TournamentSpots;
}

export const data = {
  spots: { },
  gameMap: {},
  timeSlots: [
  ]
}



/* Actions:

SeatPlayer(playerId, spotIndex) - puts player in spot
DeclareWinner(gameIndex, winnerindex) - assigns winner and loser, puts them into the new spots automatically

Display:

If spot has displayName set, 
*/
