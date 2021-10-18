import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentConfigViewComponent } from './tournament-config-view.component';

describe('TournamentConfigViewComponent', () => {
  let component: TournamentConfigViewComponent;
  let fixture: ComponentFixture<TournamentConfigViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentConfigViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentConfigViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
