import { TestBed } from '@angular/core/testing';

import { IssueAssignedUsersService } from './issue-assigned-users.service';

describe('IssueAssignedUsersService', () => {
  let service: IssueAssignedUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueAssignedUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
