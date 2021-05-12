import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationSubTaskAddedComponent } from './conversation-sub-task-added.component';

describe('ConversationSubTaskAddedComponent', () => {
  let component: ConversationSubTaskAddedComponent;
  let fixture: ComponentFixture<ConversationSubTaskAddedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversationSubTaskAddedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationSubTaskAddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
