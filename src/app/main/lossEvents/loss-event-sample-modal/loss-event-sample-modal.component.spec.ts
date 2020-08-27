/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LossEventSampleModalComponent } from './loss-event-sample-modal.component';

describe('LossEventSampleModalComponent', () => {
  let component: LossEventSampleModalComponent;
  let fixture: ComponentFixture<LossEventSampleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LossEventSampleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LossEventSampleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
