import { TestBed } from '@angular/core/testing';

import { IssueParentService } from './issue-parent.service';

describe('IssueParentService', () => {
  let service: IssueParentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueParentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
