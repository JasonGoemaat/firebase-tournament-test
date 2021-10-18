import { Component, OnDestroy, OnInit } from '@angular/core';
import { doc, getFirestore, onSnapshot, setDoc } from '@firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import { Observable, Observer, ReplaySubject } from 'rxjs';
import { delay, first, timestamp } from 'rxjs/operators';
import { TimeSlot, Tournament } from './models/tournament';
import { AuthInfo, FirebaseUtilService } from './shared/firebase-util.service';

import { defaultConfig } from './models/tournament-config'

const participantsBySeed = [
  'Jeff Livingston',
  'Craig Tassin',
  'Jason Goemaat',
  'Brent Kolk',
  'Chris Goldenstein',
  'Ryan Moorhead',
  'Kade Rosa',
  'Jack Rosa',
  'Danny Martin',
  'Tim Martin',
  'Doug',
  'Bill Polka',
  'www',
  'xxx',
  'yyy',
  'zzz'
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
  config = defaultConfig;

  constructor(public fu: FirebaseUtilService) {
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
      this.tournament$.next(doc.data() as Tournament);
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
        name: `Jack's 2021 8 Ball Invitational`,
        scheduleMinutes: 30,
        timeSlots: []
      }

      const utc = Date.UTC(2021, 9, 29, 14); // 10/30/2021 at 09:00 am CST


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
    let utc = Date.UTC(2021, 9, 29, 14); // 09:00 am CST on 10/23/2021
    this.authInfo$.pipe(first()).subscribe(async (auth) => {
      this.tournament$.pipe(first()).subscribe(async (tournament) => {
        const slots: TimeSlot[] = [];
        const ms = tournament.scheduleMinutes * 60 * 1000;
        config.games.forEach((game, index) => {
          slots.push({ utc, gameId: index });
          utc += tournament.scheduleMinutes * 30 * 60 * 1000;
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

        // move 2nd round winner up in time
        moveGame(slots, 12, 8);
        moveGame(slots, 13, 9);
        moveGame(slots, 14, 10);
        moveGame(slots, 15, 11);

        tournament.timeSlots = slots;
        const db = getFirestore();
        const result = await setDoc(doc(db, "tournaments", "mine"), tournament);
        console.log('added timeSlots with setDoc:');
        console.log(result);
      })
    });
  }
}
