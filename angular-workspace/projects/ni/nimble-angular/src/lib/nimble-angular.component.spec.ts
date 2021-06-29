import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NimbleAngularComponent } from './nimble-angular.component';

describe('NimbleAngularComponent', () => {
  let component: NimbleAngularComponent;
  let fixture: ComponentFixture<NimbleAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NimbleAngularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NimbleAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
