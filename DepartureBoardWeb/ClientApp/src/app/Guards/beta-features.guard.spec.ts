import { TestBed } from '@angular/core/testing';

import { BetaFeaturesGuard } from './beta-features.guard';

describe('BetaFeaturesGuard', () => {
  let guard: BetaFeaturesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BetaFeaturesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
