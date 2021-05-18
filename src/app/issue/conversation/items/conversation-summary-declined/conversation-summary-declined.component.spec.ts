import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationSummaryDeclinedComponent } from './conversation-summary-declined.component';

describe('ConversationSummaryDeclinedComponent', () => {
  let component: ConversationSummaryDeclinedComponent;
  let fixture: ComponentFixture<ConversationSummaryDeclinedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversationSummaryDeclinedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationSummaryDeclinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
