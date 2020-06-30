import { TestBed } from '@angular/core/testing';

import { DepartureService } from './departure.service';

describe('DepartureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DepartureService = TestBed.get(DepartureService);
    expect(service).toBeTruthy();
  });
});
