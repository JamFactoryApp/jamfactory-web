import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueSongComponent } from './queue-song.component';

describe('QueueSongComponent', () => {
  let component: QueueSongComponent;
  let fixture: ComponentFixture<QueueSongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueSongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
