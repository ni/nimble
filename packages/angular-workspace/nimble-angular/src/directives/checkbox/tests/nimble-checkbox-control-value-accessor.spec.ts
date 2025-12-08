import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { parameterizeSuite } from '@ni/jasmine-parameterized';
import { processUpdates } from '../../../testing/async-helpers';
import type { Checkbox } from '../nimble-checkbox.directive';
import { NimbleCheckboxModule } from '../nimble-checkbox.module';

function toggleCheckboxValue(checkbox: Checkbox): void {
    checkbox.click();
}

describe('Nimble checkbox control value accessor', () => {
    @Component({
        template: `
            <nimble-checkbox #checkbox [(ngModel)]="value" (ngModelChange)="onModelValueChange($event)" [disabled]="fieldDisabled"></nimble-checkbox>
         `,
        standalone: false
    })
    class TestHostComponent {
        @ViewChild('checkbox', { static: true }) public checkbox: ElementRef<Checkbox>;

        public readonly initialValue = true;
        public value = this.initialValue;
        public fieldDisabled = false;

        public onModelValueChange(_value: boolean): void {}
    }

    let checkbox: Checkbox;
    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleCheckboxModule, FormsModule]
        });
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        checkbox = testHostComponent.checkbox.nativeElement;
        fixture.detectChanges();
        tick();
    }));

    afterEach(() => {
        processUpdates();
    });

    it('sets correct initial value', () => {
        expect(testHostComponent.value).toBe(testHostComponent.initialValue);
        expect(checkbox.checked).toBe(testHostComponent.initialValue);
    });

    it('updates value when bound property is changed', fakeAsync(() => {
        const newValue = false;
        testHostComponent.value = newValue;
        fixture.detectChanges();
        tick();

        expect(checkbox.checked).toBe(newValue);
    }));

    it('updates bound property when value is changed', () => {
        toggleCheckboxValue(checkbox);
        fixture.detectChanges();

        expect(testHostComponent.value).toBe(false);
    });

    it('sets "disabled" attribute with value of bound property', fakeAsync(() => {
        testHostComponent.fieldDisabled = true;
        fixture.detectChanges();
        tick();
        processUpdates();

        expect(checkbox.getAttribute('disabled')).toBe('');
        expect(checkbox.disabled).toBe(true);
    }));

    it('fires ngModelChange one time with expected value', () => {
        const ngModelChangeSpy = spyOn(testHostComponent, 'onModelValueChange');
        toggleCheckboxValue(checkbox);
        fixture.detectChanges();

        expect(ngModelChangeSpy).toHaveBeenCalledOnceWith(false);
    });
});

const testCases = [
    { name: 'initial value: true, non-nullable: true', initialValue: true, nonNullable: true },
    { name: 'initial value: false, non-nullable: true', initialValue: false, nonNullable: true },
    { name: 'initial value: null, non-nullable: false', initialValue: null, nonNullable: false },
    { name: 'initial value: true, non-nullable: false', initialValue: true, nonNullable: false },
    { name: 'initial value: false, non-nullable: false', initialValue: false, nonNullable: false },
];
parameterizeSuite(testCases, (suite, name, value) => {
    suite(`Nimble checkbox control value accessor with formControl configured with ${name}`, () => {
        @Component({
            template: `
                <nimble-checkbox
                    #checkbox
                    [formControl]="testFormControl"
                ></nimble-checkbox>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('checkbox', { static: true }) public checkbox: ElementRef<Checkbox>;

            public testFormControl = new FormControl(value.initialValue, { nonNullable: value.nonNullable });
        }

        let checkbox: Checkbox;
        let fixture: ComponentFixture<TestHostComponent>;
        let testHostComponent: TestHostComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleCheckboxModule, FormsModule, ReactiveFormsModule]
            });
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(TestHostComponent);
            testHostComponent = fixture.componentInstance;
            checkbox = testHostComponent.checkbox.nativeElement;
            fixture.detectChanges();
        });

        it('updates value when formControl value is changed', () => {
            const newValue = !value.initialValue;
            testHostComponent.testFormControl.setValue(newValue);
            fixture.detectChanges();

            expect(checkbox.checked).toBe(newValue);
        });

        it('updates formControl value when checkbox is changed', () => {
            toggleCheckboxValue(checkbox);
            fixture.detectChanges();

            const expectedUpdatedValue = !value.initialValue;
            expect(testHostComponent.testFormControl.value).toBe(expectedUpdatedValue);
        });

        it('sets "disabled" attribute with disabled state of formControl', () => {
            testHostComponent.testFormControl.disable();
            fixture.detectChanges();
            processUpdates();

            expect(checkbox.getAttribute('disabled')).toBe('');
            expect(checkbox.disabled).toBe(true);
        });

        it('resets the formControl value', () => {
            toggleCheckboxValue(checkbox);
            fixture.detectChanges();

            const toggledValue = !value.initialValue;
            expect(testHostComponent.testFormControl.value).toBe(toggledValue);

            testHostComponent.testFormControl.reset();
            fixture.detectChanges();

            const expectedResetValue = value.nonNullable ? value.initialValue : null;
            expect(testHostComponent.testFormControl.value).toBe(expectedResetValue);
        });
    });
});
