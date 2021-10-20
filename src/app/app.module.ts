import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TournamentTestComponent } from './tournament-test/tournament-test.component';

import { initializeApp } from "firebase/app";
import { TournamentViewComponent } from './tournament-view/tournament-view.component';
import { TournamentConfigViewComponent } from './tournament-config-view/tournament-config-view.component';
import { TournamentSpotComponent } from './tournament-spot/tournament-spot.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material.module';
import { SpotDialogComponent } from './spot-dialog/spot-dialog.component';
import { FormsModule } from '@angular/forms';

const firebaseConfig = {
  apiKey: "AIzaSyDyEMGADaBOQW1F36QtoPFYDGJzdFETvrs",
  authDomain: "goemaat-multiple-apps.firebaseapp.com",
  projectId: "goemaat-multiple-apps",
  storageBucket: "goemaat-multiple-apps.appspot.com",
  messagingSenderId: "272957249934",
  appId: "1:272957249934:web:152a624721165bf5e0acdf"
};

initializeApp( firebaseConfig );

@NgModule({
  declarations: [
    AppComponent,
    TournamentTestComponent,
    TournamentViewComponent,
    TournamentConfigViewComponent,
    TournamentSpotComponent,
    SpotDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    AppMaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
