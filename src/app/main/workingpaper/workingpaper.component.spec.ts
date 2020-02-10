import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingpaperComponent } from './workingpaper.component';

describe('WorkingpaperComponent', () => {
  let component: WorkingpaperComponent;
  let fixture: ComponentFixture<WorkingpaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingpaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingpaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
