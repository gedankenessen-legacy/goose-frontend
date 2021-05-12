import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationSummaryAcceptedComponent } from './conversation-summary-accepted.component';

describe('ConversationSummaryAcceptedComponent', () => {
  let component: ConversationSummaryAcceptedComponent;
  let fixture: ComponentFixture<ConversationSummaryAcceptedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversationSummaryAcceptedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationSummaryAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
