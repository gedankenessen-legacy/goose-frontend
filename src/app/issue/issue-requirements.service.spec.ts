import { TestBed } from '@angular/core/testing';

import { IssueRequirementsService } from './issue-requirements.service';

describe('IssueRequirementsService', () => {
  let service: IssueRequirementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueRequirementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
