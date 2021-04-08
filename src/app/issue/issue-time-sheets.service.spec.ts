import { TestBed } from '@angular/core/testing';

import { IssueTimeSheetsService } from './issue-time-sheets.service';

describe('IssueTimeSheetsService', () => {
  let service: IssueTimeSheetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueTimeSheetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
