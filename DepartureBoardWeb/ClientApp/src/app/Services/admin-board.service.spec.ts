import { TestBed } from '@angular/core/testing';

import { AdminBoardService } from './admin-board.service';

describe('AdminBoardService', () => {
  let service: AdminBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
