import { TestBed } from '@angular/core/testing';

import { JamsessionService } from './jamsession.service';

describe('JamSessionService', () => {
  let service: JamsessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JamsessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
