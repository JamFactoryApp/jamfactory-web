import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaybackControllerComponent } from './playback-controller.component';

describe('PlaybackControllerComponent', () => {
  let component: PlaybackControllerComponent;
  let fixture: ComponentFixture<PlaybackControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaybackControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaybackControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
