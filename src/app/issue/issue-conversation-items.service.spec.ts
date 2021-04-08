import { TestBed } from '@angular/core/testing';

import { IssueConversationItemsService } from './issue-conversation-items.service';

describe('IssueConversationItemsService', () => {
  let service: IssueConversationItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueConversationItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
