import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentTestComponent } from './tournament-test.component';

describe('TournamentTestComponent', () => {
  let component: TournamentTestComponent;
  let fixture: ComponentFixture<TournamentTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
