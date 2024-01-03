import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { processUpdates } from '../../../testing/async-helpers';
import type { NumberField } from '../nimble-number-field.directive';
import { NimbleNumberFieldModule } from '../nimble-number-field.module';

describe('Nimble number field control value accessor', () => {
    @Component({
        template: `
            <nimble-number-field #numberField [(ngModel)]="value" (ngModelChange)="onModelValueChange($event)" [disabled]="fieldDisabled" [min]="0"></nimble-number-field>
         `
    })
    class TestHostComponent {
        @ViewChild('numberField', { static: true }) public numberField: ElementRef<NumberField>;

        public readonly initialValue = 123;
        public value = this.initialValue;
        public fieldDisabled = false;

        public onModelValueChange(_value: number): void { }
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
        processUpdates();
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
        numberField.value = newValue.toString();
        fixture.detectChanges();

        expect(testHostComponent.value).toBe(newValue);
    });

    it('sets "disabled" attribute with value of bound property', fakeAsync(() => {
        testHostComponent.fieldDisabled = true;
        fixture.detectChanges();
        tick();
        processUpdates();

        expect(numberField.getAttribute('disabled')).toBe('');
        expect(numberField.disabled).toBe(true);
    }));

    it('fires ngModelChange one time with expected value', () => {
        const ngModelChangeSpy = spyOn(testHostComponent, 'onModelValueChange').and.callThrough();
        const newValue = 1;
        numberField.value = newValue.toString();
        fixture.detectChanges();
        expect(ngModelChangeSpy).toHaveBeenCalledOnceWith(newValue);
    });
});
