import { TestBed } from '@angular/core/testing';

import { IssueSuccessorsService } from './issue-successors.service';

describe('IssueSuccessorsService', () => {
  let service: IssueSuccessorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueSuccessorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
