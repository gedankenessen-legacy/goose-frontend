import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationSubTaskRemovedComponent } from './conversation-sub-task-removed.component';

describe('ConversationSubTaskRemovedComponent', () => {
  let component: ConversationSubTaskRemovedComponent;
  let fixture: ComponentFixture<ConversationSubTaskRemovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversationSubTaskRemovedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationSubTaskRemovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
