import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import type { NumberField } from '@ni/nimble-components/dist/esm/number-field';
import { NimbleNumberFieldModule } from '../nimble-number-field.module';
import { processDomUpdates } from '../../../async-test-utilities';

function setNumberFieldValue(numberField: NumberField, value: number): void {
    numberField.value = value.toString();
    numberField.dispatchEvent(new Event('input'));
    numberField.dispatchEvent(new Event('change'));
}

describe('Nimble number field control value accessor', () => {
    @Component({
        template: `
            <nimble-number-field #numberField [(ngModel)]="value" [disabled]="fieldDisabled" [min]="0"></nimble-number-field>
         `
    })
    class TestHostComponent {
        @ViewChild('numberField', { static: true }) public numberField: ElementRef<NumberField>;

        public readonly initialValue = 123;
        public value = this.initialValue;
        public fieldDisabled = false;
    }

    let numberField: NumberField;
    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleNumberFieldModule, FormsModule]
        });
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        numberField = testHostComponent.numberField.nativeElement;
        fixture.detectChanges();
        tick();
    }));

    afterEach(() => {
        processDomUpdates();
    });

    it('sets correct initial value', () => {
        expect(testHostComponent.value).toBe(testHostComponent.initialValue);
        expect(parseFloat(numberField.value)).toBe(testHostComponent.initialValue);
    });

    it('updates value when bound property is changed', fakeAsync(() => {
        const newValue = 1;
        testHostComponent.value = newValue;
        fixture.detectChanges();
        tick();

        expect(parseFloat(numberField.value)).toBe(newValue);
    }));

    it('updates bound property when value is changed', () => {
        const newValue = 1;
        setNumberFieldValue(numberField, newValue);
        fixture.detectChanges();

        expect(testHostComponent.value).toBe(newValue);
    });

    it('sets "disabled" attribute with value of bound property', fakeAsync(() => {
        testHostComponent.fieldDisabled = true;
        fixture.detectChanges();
        tick();
        processDomUpdates();

        expect(numberField.getAttribute('disabled')).toBe('');
        expect(numberField.disabled).toBe(true);
    }));
});
