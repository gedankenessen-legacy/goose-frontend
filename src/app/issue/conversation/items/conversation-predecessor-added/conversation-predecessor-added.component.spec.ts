import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationPredecessorAddedComponent } from './conversation-predecessor-added.component';

describe('ConversationPredecessorAddedComponent', () => {
  let component: ConversationPredecessorAddedComponent;
  let fixture: ComponentFixture<ConversationPredecessorAddedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversationPredecessorAddedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationPredecessorAddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
