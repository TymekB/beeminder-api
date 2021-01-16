import { TestBed } from '@angular/core/testing';

import { BeeminderService } from './beeminder.service';

describe('BeeminderService', () => {
  let service: BeeminderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeeminderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
