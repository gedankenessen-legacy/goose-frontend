import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterdashboardComponent } from './registerdashboard.component';

describe('RegisterdashboardComponent', () => {
  let component: RegisterdashboardComponent;
  let fixture: ComponentFixture<RegisterdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterdashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
