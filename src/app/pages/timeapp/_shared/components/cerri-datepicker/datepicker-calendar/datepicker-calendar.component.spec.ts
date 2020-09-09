import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CerriDatepickerComponent } from './datepicker-calendar.component';

describe('DatepickerComponent', () => {
  let component: CerriDatepickerComponent;
  let fixture: ComponentFixture<CerriDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CerriDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CerriDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
