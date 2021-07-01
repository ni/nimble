import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NimbleNumberFieldComponent } from '../nimble-number-field.component';

describe('NimbleAngularComponent', () => {
    let component: NimbleNumberFieldComponent;
    let fixture: ComponentFixture<NimbleNumberFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NimbleNumberFieldComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NimbleNumberFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
