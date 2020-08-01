import { TestBed } from '@angular/core/testing';

import { BusDepartureService } from './bus-departure.service';

describe('BusDepartureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BusDepartureService = TestBed.get(BusDepartureService);
    expect(service).toBeTruthy();
  });
});
