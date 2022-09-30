import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavDrawerComponent } from './nav-drawer.component';

describe('NavDrawerComponent', () => {
  let component: NavDrawerComponent;
  let fixture: ComponentFixture<NavDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
