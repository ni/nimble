import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleNumberFieldModule, NimbleNumberFieldComponent } from '../index';

describe('NimbleAngularComponent', () => {
    let component: NimbleNumberFieldComponent;
    let fixture: ComponentFixture<NimbleNumberFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NimbleNumberFieldComponent],
            imports: [NimbleNumberFieldModule]
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
