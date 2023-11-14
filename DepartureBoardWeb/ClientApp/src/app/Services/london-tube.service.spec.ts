import { TestBed } from '@angular/core/testing';

import { LondonTubeService } from './london-tube.service';

describe('LondonTubeService', () => {
  let service: LondonTubeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LondonTubeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
