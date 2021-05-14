import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationPredecessorRemovedComponent } from './conversation-predecessor-removed.component';

describe('ConversationPredecessorRemovedComponent', () => {
  let component: ConversationPredecessorRemovedComponent;
  let fixture: ComponentFixture<ConversationPredecessorRemovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversationPredecessorRemovedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationPredecessorRemovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
