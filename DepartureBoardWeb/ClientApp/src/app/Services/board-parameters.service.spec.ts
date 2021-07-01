import { TestBed } from '@angular/core/testing';

import { BoardParametersService } from './board-parameters.service';

describe('BoardParametersService', () => {
  let service: BoardParametersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardParametersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
