import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NimbleSelectComponent } from '../nimble-select.component';

describe('NimbleSelectComponent', () => {
    let component: NimbleSelectComponent;
    let fixture: ComponentFixture<NimbleSelectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NimbleSelectComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NimbleSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
