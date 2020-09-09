import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TimeAppComponent } from './timeapp.component';

describe('TimeappComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
          TimeAppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(TimeAppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'time-app'`, () => {
    const fixture = TestBed.createComponent(TimeAppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('time-app');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(TimeAppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to time-app!');
  });
});
