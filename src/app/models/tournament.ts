export interface Participant {
  key: string | null;
  uid: string | null;
  name: string | null;
  preferredName: string | null;
  seed: number | undefined;
}

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
  displayTime?: string;
  displayName?: string;
  className?: string;
}

export type TournamentSpots = Record<number, TournamentSpot>;

export interface TournamentData {
  spots: TournamentSpots;
}

export const data = {
  spots: {
    0: { displayName: 'Jeff Livingston', isWinner: true },
    1: { displayName: 'Kade Rosa', isLoser: true },
    2: { displayName: 'Jason Goemaat', isWinner: true },
    3: { displayName: 'Brent Kolk', isLoser: true },
    4: { displayName: 'Danny Martin', isLoser: true },
    5: { displayName: 'Jack Rosa', isWinner: true },
    6: { displayName: 'Doug Liebe', isLoser: true },
    7: { displayName: 'Chris Goldenstein', isWinner: true },
    8: { displayName: 'Tim Martin', isWinner: true },
    9: { displayName: 'Kurt Berry', isLoser: true },
    10: { displayName: 'DJ Weber', isWinner: true },
    11: { displayName: 'Bill Polka', isLoser: true },
    12: { displayName: 'Ryan Moorhead', isWinner: true },
    13: { displayName: 'Ed Heritage', isLoser: true },
    14: { displayName: 'BYE', isLoser: true },
    15: { displayName: 'Craig Tassin', isWinner: true },
    16: { displayName: 'Kade Rosa' },
    17: { displayName: 'Brent Kolk' },
    18: { displayName: 'Danny Martin' },
    19: { displayName: 'Doug Liebe' },
    20: { displayName: 'Kurt Berry' },
    21: { displayName: 'Bill Polka' },
    22: { displayName: 'Ed Heritage' },
    23: { displayName: 'BYE' },
    24: { displayTime: '09:00 am' },
    25: { displayTime: '09:30 am' },
    26: { displayTime: '10:00 am' },
    27: { displayTime: '10:30 am' },
    28: { displayTime: '11:00 am' },
    29: { displayTime: '11:30 am' },
    30: { displayTime: '12:00 am' },
    31: { displayTime: '12:30 am' },
  },
  gameTimes: {
    0: '09:00 am',
    1: '09:30 am',
    2: '10:00 am',
    3: '10:30 am',
    4: '11:00 am',
    5: '11:30 am',
    6: '12:00 am',
    7: '12:30 am',
  },
}


/* Actions:

SeatPlayer(playerId, spotIndex) - puts player in spot
DeclareWinner(gameIndex, winnerindex) - assigns winner and loser, puts them into the new spots automatically

Display:

If spot has displayName set, 
*/
