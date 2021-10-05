// eslint-disable-next-line max-classes-per-file
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NumberField } from '@ni/nimble-components/dist/esm/number-field';
import { NimbleNumberFieldModule } from '../nimble-number-field.module';
import { waitAnimationFrame, waitMicrotask } from '../../../async-test-utilities';

function setNumberFieldValue(numberField: NumberField, value: number): void {
    numberField.value = value.toString();
    numberField.dispatchEvent(new Event('input'));
    numberField.dispatchEvent(new Event('change'));
}

describe('Nimble number field control value accessor', () => {
    describe('using [(ngModel)] binding', () => {
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

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleNumberFieldModule, FormsModule]
            }).compileComponents();
        });

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestHostComponent);
            testHostComponent = fixture.componentInstance;
            numberField = testHostComponent.numberField.nativeElement;
            fixture.detectChanges();
        });

        it('sets correct initial value', () => {
            expect(testHostComponent.value).toBe(testHostComponent.initialValue);
            expect(parseFloat(numberField.value)).toBe(testHostComponent.initialValue);
        });

        it('updates value when bound property is changed', async () => {
            const newValue = 1;
            testHostComponent.value = newValue;
            fixture.detectChanges();
            await waitMicrotask();

            expect(parseFloat(numberField.value)).toBe(newValue);
        });

        it('updates bound property when value is changed', async () => {
            const newValue = 1;
            setNumberFieldValue(numberField, newValue);
            fixture.detectChanges();

            expect(testHostComponent.value).toBe(newValue);
        });

        it('sets "disabled" attribute with value of bound property', async () => {
            testHostComponent.fieldDisabled = true;
            fixture.detectChanges();
            await waitAnimationFrame();

            expect(numberField.getAttribute('disabled')).toBe('');
            expect(numberField.disabled).toBe(true);
        });
    });

    describe('using [value] binding', () => {
        @Component({
            template: `
                <nimble-number-field #numberField [value]="value" (change)="valueChanged()"></nimble-number-field>
             `
        })
        class TestHostComponent {
            @ViewChild('numberField', { static: true }) public numberField: ElementRef<NumberField>;

            public readonly initialValue = 123;
            public value = this.initialValue;

            public valueChanged(): void {
                this.value = parseFloat(this.numberField.nativeElement.value);
            }
        }

        let numberField: NumberField;
        let fixture: ComponentFixture<TestHostComponent>;
        let testHostComponent: TestHostComponent;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleNumberFieldModule, FormsModule]
            }).compileComponents();
        });

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestHostComponent);
            testHostComponent = fixture.componentInstance;
            numberField = testHostComponent.numberField.nativeElement;
            fixture.detectChanges();
        });

        it('should set correct initial value', () => {
            expect(testHostComponent.value).toBe(testHostComponent.initialValue);
            expect(parseFloat(numberField.value)).toBe(testHostComponent.initialValue);
        });

        it('should update value when bound property is changed', async () => {
            const newValue = 1;
            testHostComponent.value = newValue;
            fixture.detectChanges();
            await waitMicrotask();

            expect(parseFloat(numberField.value)).toBe(newValue);
        });

        it('should update bound property when value is changed', async () => {
            const newValue = 1;
            setNumberFieldValue(numberField, newValue);
            fixture.detectChanges();

            expect(testHostComponent.value).toBe(newValue);
        });
    });
});
