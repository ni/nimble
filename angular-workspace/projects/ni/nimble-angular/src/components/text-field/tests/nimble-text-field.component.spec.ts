import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NimbleTextFieldComponent, NimbleTextFieldModule } from '../index';

describe('NimbleAngularComponent', () => {
    let component: NimbleTextFieldComponent;
    let fixture: ComponentFixture<NimbleTextFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NimbleTextFieldComponent],
            imports: [NimbleTextFieldModule]
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
