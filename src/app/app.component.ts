import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { doc, getFirestore, onSnapshot, setDoc } from '@firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import { Observable, Observer, ReplaySubject } from 'rxjs';
import { delay, first, timestamp } from 'rxjs/operators';
import { ParticipantMap, TimeSlot, Tournament } from './models/tournament';
import { AuthInfo, FirebaseUtilService } from './shared/firebase-util.service';
import { TournamentViewModel } from './models/tournament-view-model';
import { defaultConfig } from './models/tournament-config'
import * as moment from "moment";

(window as any).moment = moment;

const participantsBySeed = [
  'Jeff Livingston', // 1
  'Craig Tassin', // 2
  'Tim Martin', // 3
  'Chris Goldenstein', // 4
  'Danny Martin', // 5
  'Bill Polka', // 6
  'Ryan Moorhead', // 7
  'Brent Kolk', // 8
  'Jason Goemaat', // 9
  'Ed Heritage', // 10
  'DJ Weber', // 11
  'Jack Rosa', // 12
  'Doug Liebe', // 13
  'Kurt Berry', // 14
  'Unknown', // 15
  'Kade Rosa', // 16
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'firebase-tournament-test';
  authInfo$: Observable<AuthInfo>;
  time$: Observable<string>;
  unsubs: any[] = [];
  tournament$ = new ReplaySubject<Tournament>(1);
  tournamentViewModel$ = new ReplaySubject<TournamentViewModel>(1);
  config = defaultConfig;
  open = { one: false, auth: false, commands: true, json: false, config: false, view: true };

  constructor(public fu: FirebaseUtilService, readonly cd: ChangeDetectorRef) {
    (window as any).capp = this;
    this.authInfo$ = fu.auth.pipe(delay(1));
    this.time$ = new Observable<string>((observer: Observer<string>) => {
      setInterval(() => observer.next(new Date().toString()), 1000);
    })
  }

  ngOnInit() {
    this.watchTournament();
  }

  ngOnDestroy() {
    this.unsubs.forEach(unsub => unsub());
  }

  watchTournament() {
    const db = getFirestore();
    const unsub = onSnapshot(doc(db, "tournaments", "mine"), (doc) => {
      console.log('got doc!', doc.data());
      const tournament = doc.data() as Tournament;
      const tournamentViewModel = new TournamentViewModel(defaultConfig, tournament);

      this.tournament$.next(tournament);
      this.tournamentViewModel$.next(tournamentViewModel);
      (window as any).tournament = tournament;
      (window as any).tournamentViewModel = tournamentViewModel;
    });
    this.unsubs.push(unsub);
  }

  addTournament() {
    this.authInfo$.pipe(first()).subscribe(async (auth) => {
      const db = getFirestore();
      const tournament: Tournament = {
        isPublic: true,
        ownerName: auth.name as string,
        ownerUid: auth.uid as string,
        participants: [],
        name: `13th Annual Tournament Of The Rosa's`,
        scheduleMinutes: 30,
        timeSlots: [],
        gameMap: {},
        participantMap: {},
        resultMap: {},
      }

      const result = await setDoc(doc(db, "tournaments", "mine"), tournament);
      console.log('added tournament with setDoc:');
      console.log(result);
    })
  }

  deleteTournament() {
    this.authInfo$.pipe(first()).subscribe(async (auth) => {
      const db = getFirestore();
      const result = await deleteDoc(doc(db, "tournaments", "mine"));
      console.log('deleted tournament with deleteDoc:');
      console.log(result);
    })
  }

  addParticipant() {
    this.authInfo$.pipe(first()).subscribe(async (auth) => {
      this.tournament$.pipe(first()).subscribe(async (tournament) => {
        if (tournament.participants.length < participantsBySeed.length) {
          const db = getFirestore();

          tournament.participants?.push({
            name: participantsBySeed[tournament.participants.length],
            id: tournament.participants.length + 1,
            seed: tournament.participants.length + 1,
            uid: '',
          })
          const result = await setDoc(doc(db, "tournaments", "mine"), tournament);
          console.log('added participant with setDoc:');
          console.log(result);
        }
      })
    });
  }

  scheduleTimes() {
    // I imagine adding these with some ui, date picker to pick start time and
    // slider to pick how many from remaining games.  Can move game ids around
    // and entire array will be re-arranged accordingly and written as one object.
    // for now we use hard-coded start time and create a slot for every game.
    // In the future we might add a table or have separate time slots for tables,
    // then we have to make sure according to the schedule that every game has
    // doesn't start until games have finished to provide participants.
    const config = defaultConfig;
    let utc = Date.UTC(2021, 9, 30, 14); // 09:00 am CST on 10/30/2021
    this.authInfo$.pipe(first()).subscribe(async (auth) => {
      this.tournament$.pipe(first()).subscribe(async (tournament) => {
        const slots: TimeSlot[] = [];
        const ms = tournament.scheduleMinutes * 60 * 1000;
        config.games.forEach((game, index) => {
          slots.push({ utc, gameId: index });
          utc += ms;
        });

        const moveGame = (slots: TimeSlot[], gameId: number, newIndex: number) => {
          let pos = slots.findIndex(slot => slot.gameId == gameId);
          if (pos >= 0) {
            while (pos > newIndex) {
              slots[pos].gameId = slots[pos - 1].gameId;
              pos--;
            }
            while (pos < newIndex) {
              slots[pos].gameId = slots[pos + 1].gameId;
              pos++;
            }
            slots[pos].gameId = gameId;
          }
        }

        // 0-7 is 1st round winner

        // 8-11 is 2nd round winner, move up in time
        moveGame(slots, 12, 8);
        moveGame(slots, 13, 9);
        moveGame(slots, 14, 10);
        moveGame(slots, 15, 11);

        // 12-19 are 1st and 2nd round loser, already in order

        // 20-21 are 3rd round loser, move up 2
        moveGame(slots, 22, 20)
        moveGame(slots, 23, 21)

        // 22-23 are 3rd round winner, already in order
        
        // 24-25 are 4th round loser, already in order

        // 26-28 are playoffs for 7th-8th and 5th-6th, then 4th
        moveGame(slots, 32, 26) // LM
        moveGame(slots, 31, 27) // LN
        moveGame(slots, 27, 28) // LO

        // WO

        tournament.timeSlots = slots;
        const db = getFirestore();
        const result = await setDoc(doc(db, "tournaments", "mine"), tournament);
        console.log('added timeSlots with setDoc:');
        console.log(result);

        console.log('%cSchedule:', 'padding: 5px; border-radius: 5px; background-color: #202080; color: white; padding-left: 200px; padding-right: 200px;');
        tournament.timeSlots.forEach(x => {
          const { gameId, utc } = x;
          const game = config.games[gameId];
          console.log(`${game.name} (${gameId})`, new Date(utc).toLocaleTimeString());
        });
      })
    });
  }

  /**
   * Participants should be added, this will seed them according to config
   */
  seedTournament() {
    this.authInfo$.pipe(first()).subscribe(async (auth) => {
      this.tournament$.pipe(first()).subscribe(async (tournament) => {
        let participantMap: ParticipantMap = {};
        const config = defaultConfig;
        config.spots.forEach((spot, spotIndex) => {
          if (typeof(spot.seed) === 'number') {
            console.log(spotIndex, spot);
            participantMap[spotIndex] = tournament.participants.find(participant => participant.seed === spot.seed)?.id as number;
          }
        });

        tournament.participantMap = participantMap;
        const db = getFirestore();
        const result = await setDoc(doc(db, "tournaments", "mine"), tournament);
        console.log('added participantMap with setDoc:');
        console.log(result);
      });
    });
  }

  completeAGame() {
    this.authInfo$.pipe(first()).subscribe(async (auth) => {
      this.tournament$.pipe(first()).subscribe(async (tournament) => {
        const db = getFirestore();

        const vm = new TournamentViewModel(this.config, tournament);
        const [game] = vm.getGames(true);
        const winnerId = Math.random() >= 0.5 ? game.participantA.id : game.participantB.id;
        vm.declareWinner(game.gameId, winnerId as number);
        const result = await setDoc(doc(db, "tournaments", "mine"), vm.tournament);
        console.log(`set winner to ${winnerId}:`, game);
        console.log(result);
        this.cd.markForCheck();
      })
    });
  }

  resetGames() {
    this.authInfo$.pipe(first()).subscribe(async (auth) => {
      this.tournament$.pipe(first()).subscribe(async (tournament) => {
        const db = getFirestore();
        
        // remove all but seeded participants
        for(const k in tournament.participantMap) {
          if(Number(k) > 15) {
            delete tournament.participantMap[k]
          }
        }

        // remove resultMap and gameMap
        tournament.resultMap = {};
        tournament.gameMap = {};

        const result = await setDoc(doc(db, "tournaments", "mine"), tournament);
        console.log('resetGames()', result);
      })
    });
  }

  signIn() {
    this.fu.signIn();
  }

  signOut() {
    this.fu.signOut();
  }
}
