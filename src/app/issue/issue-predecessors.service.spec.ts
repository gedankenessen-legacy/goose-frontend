import { TestBed } from '@angular/core/testing';

import { IssuePredecessorsService } from './issue-predecessors.service';

describe('IssuePredecessorsService', () => {
  let service: IssuePredecessorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssuePredecessorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
