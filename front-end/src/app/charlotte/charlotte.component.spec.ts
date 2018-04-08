import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharlotteComponent } from './charlotte.component';

describe('CharlotteComponent', () => {
  let component: CharlotteComponent;
  let fixture: ComponentFixture<CharlotteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharlotteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharlotteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
