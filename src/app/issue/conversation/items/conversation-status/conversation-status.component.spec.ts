import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationStatusComponent } from './conversation-status.component';

describe('ConversationStatusComponent', () => {
  let component: ConversationStatusComponent;
  let fixture: ComponentFixture<ConversationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversationStatusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
