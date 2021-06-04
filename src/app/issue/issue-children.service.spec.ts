import { TestBed } from '@angular/core/testing';

import { IssueChildrenService } from './issue-children.service';

describe('IssueChildrenService', () => {
  let service: IssueChildrenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueChildrenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
