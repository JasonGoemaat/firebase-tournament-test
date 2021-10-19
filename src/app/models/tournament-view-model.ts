import { Tournament } from "./tournament";
import { TournamentConfig, TournamentSpotConfig } from "./tournament-config";

export interface SpotViewModel {
    isWinner?: boolean;
    isLoser?: boolean;
    isItalic?: boolean;
    gameName?: string;
    text: string;
    config: TournamentSpotConfig;
}

const rxTime = /([0-9]+:)([0-9]+):[0-9]+( AM| PM)/
const getTimeString = (utc: number) => {
    const lts = new Date(utc).toLocaleTimeString();
    const arr = lts.match(rxTime);
    return arr ? arr.slice(1).join('') : 'BAD TIME';
}

export class TournamentViewModel {
    public spots: SpotViewModel[];

    constructor(public config: TournamentConfig, tournament: Tournament) {
        const spots = config.spots.map((spotConfig, index) => <SpotViewModel>{ text: `Spot ${index}`, config: spotConfig });
        this.spots = spots;

        // process games adding game name and time
        config.games.forEach((gameConfig, gameIndex) => {
            const { winnerTo, loserTo, name } = gameConfig;
            if (winnerTo) {
                spots[winnerTo].gameName = name;
                const timeSlot = tournament.timeSlots.find(ts => ts.gameId == gameIndex);
                if (timeSlot) {
                    const utc = timeSlot.utc;
                    spots[winnerTo].text = getTimeString(utc);
                } else {
                    spots[winnerTo].text = 'BAD SLOT TIME';
                }
            }
            if (loserTo) {
                spots[loserTo].text = `Loser of ${name}`
            }

            // later, check for data with winner and loser info, colorize those spots
        })

        // for seeds, use display name as text - th is is participantMap
        for(const k in tournament.participantMap) {
            const spotIndex = Number(k);
            const participantId = tournament.participantMap[spotIndex]; // participant id
            const spot = spots[spotIndex];
            const participant = tournament.participants.find(p => p.id == participantId);
            if (participant) {
                spot.text = participant.name;
                spot.config = config.spots[spotIndex];
            }
        }
    }
}