import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportwasmComponent } from './exportwasm.component';

describe('ExportwasmComponent', () => {
  let component: ExportwasmComponent;
  let fixture: ComponentFixture<ExportwasmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportwasmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportwasmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
