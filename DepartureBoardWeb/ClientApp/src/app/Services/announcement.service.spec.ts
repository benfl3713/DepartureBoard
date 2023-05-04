import { TestBed } from '@angular/core/testing';

import { AnnouncementService } from './announcement.service';

describe('AnnouncementService', () => {
  let service: AnnouncementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnouncementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
