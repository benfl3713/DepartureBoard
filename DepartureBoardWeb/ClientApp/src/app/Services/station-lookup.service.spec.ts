import { TestBed } from '@angular/core/testing';

import { StationLookupService } from './station-lookup.service';

describe('StationLookupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StationLookupService = TestBed.get(StationLookupService);
    expect(service).toBeTruthy();
  });
});
