import { Component, OnDestroy, OnInit } from '@angular/core';
import { collection, doc, getFirestore, onSnapshot, setDoc } from '@firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import { Observable, Observer, ReplaySubject } from 'rxjs';
import { delay, first } from 'rxjs/operators';
import { Tournament } from './models/tournament';
import { AuthInfo, FirebaseUtilService } from './shared/firebase-util.service';

import { defaultConfig } from './models/tournament-config'

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
        const db = getFirestore();
        tournament.participants?.push({
          name: 'Jason Goemaat',
          key: '',
          uid: '',
          preferredName: 'Jason',
          seed: 0
        })
        const result = await setDoc(doc(db, "tournaments", "mine"), tournament);
        console.log('added participant with setDoc:');
        console.log(result);
      })
    })
  }
}
