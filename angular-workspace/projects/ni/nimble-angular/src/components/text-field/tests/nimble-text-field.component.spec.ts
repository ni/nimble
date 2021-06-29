import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NimbleTextFieldComponent } from '../nimble-text-field.component';

describe('NimbleAngularComponent', () => {
    let component: NimbleTextFieldComponent;
    let fixture: ComponentFixture<NimbleTextFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ NimbleTextFieldComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NimbleTextFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
