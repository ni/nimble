import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NimbleRadioGroupModule } from '../nimble-radio-group.module';
import { NimbleRadioButtonModule, RadioButton } from '../../radio-button/nimble-radio-button.module';
import type { RadioGroup } from '../nimble-radio-group.directive';
import { processUpdates } from '../../../testing/async-helpers';

function setSelectedRadioIndex(radioGroup: RadioGroup, index: number): void {
    radioGroup.children[index].dispatchEvent(new Event('click', { bubbles: true }));
}

describe('Nimble radio group control value accessor', () => {
    describe('when using radio button\'s [ngValue] binding in a template-based form', () => {
        @Component({
            template: `
                <nimble-radio-group #radioGroup name="options" [(ngModel)]="selectedRadioButton" [disabled]="radioDisabled">
                    <nimble-radio-button *ngFor="let option of radioButtons" [ngValue]="option.value">
                        {{ option.name }}
                    </nimble-radio-button>
                </nimble-radio-group>
             `
        })
        class TestHostComponent {
            @ViewChild('radioGroup', { static: true }) public radioGroup: ElementRef<RadioGroup>;

            public radioButtons: { name: string, value: unknown }[] = [
                { name: 'Option 1', value: 1 },
                { name: 'Option 2', value: 2 },
                { name: 'Option 3', value: 3 }
            ];

            public selectedRadioButton = this.radioButtons[1].value;

            public radioDisabled = false;
        }

        let radioGroup: RadioGroup;
        let fixture: ComponentFixture<TestHostComponent>;
        let testHostComponent: TestHostComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRadioGroupModule, NimbleRadioButtonModule, FormsModule]
            });
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(TestHostComponent);
            testHostComponent = fixture.componentInstance;
            radioGroup = testHostComponent.radioGroup.nativeElement;
            fixture.detectChanges();
        });

        afterEach(() => {
            processUpdates();
        });

        it('sets correct initial selected value', async () => {
            await fixture.whenRenderingDone();
            expect((radioGroup.children[1] as RadioButton).checked).toBeTrue();
        });

        it('updates selected value when bound property is changed', async () => {
            testHostComponent.selectedRadioButton = testHostComponent.radioButtons[2].value;
            fixture.detectChanges();
            processUpdates();
            await fixture.whenRenderingDone();

            expect((radioGroup.children[2] as RadioButton).checked).toBeTrue();
        });

        it('updates bound property when selected value is changed', () => {
            setSelectedRadioIndex(radioGroup, 2);
            fixture.detectChanges();

            expect(testHostComponent.selectedRadioButton).toBe(testHostComponent.radioButtons[2].value);
        });

        it('sets "disabled" attribute with value of bound property', fakeAsync(() => {
            testHostComponent.radioDisabled = true;
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(radioGroup.getAttribute('disabled')).toBe('');
            expect(radioGroup.disabled).toBe(true);
        }));
    });

    describe('when using radio button\'s [ngValue] binding in a reactive form', () => {
        @Component({
            template: `
                <form [formGroup]="form">
                    <nimble-radio-group #radioGroup [formControl]="selectedRadioButton">
                        <nimble-radio-button *ngFor="let option of radioButtons" [ngValue]="option.value">
                            {{ option.name }}
                        </nimble-radio-button>
                    </nimble-radio-group>
                </form>
                `
        })
        class TestHostComponent {
            @ViewChild('radioGroup', { static: true }) public radioGroup: ElementRef<RadioGroup>;

            public radioButtons: { name: string, value: unknown }[] = [
                { name: 'Option 1', value: 1 },
                { name: 'Option 2', value: 2 },
                { name: 'Option 3', value: 3 }
            ];

            public selectedRadioButton = new FormControl(this.radioButtons[1].value);
            public form: FormGroup = new FormGroup({
                selectedRadioButton: this.selectedRadioButton
            });
        }

        let radioGroup: RadioGroup;
        let fixture: ComponentFixture<TestHostComponent>;
        let testHostComponent: TestHostComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRadioGroupModule, NimbleRadioButtonModule, ReactiveFormsModule]
            });
        });

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestHostComponent);
            testHostComponent = fixture.componentInstance;
            radioGroup = testHostComponent.radioGroup.nativeElement;
            fixture.detectChanges();
        });

        afterEach(() => {
            processUpdates();
        });

        it('sets correct initial selected value', async () => {
            await fixture.whenRenderingDone();
            expect((radioGroup.children[1] as RadioButton).checked).toBeTrue();
        });

        it('updates selected value when bound property is changed', async () => {
            testHostComponent.selectedRadioButton.setValue(testHostComponent.radioButtons[2].value);
            fixture.detectChanges();
            processUpdates();
            await fixture.whenRenderingDone();

            expect((radioGroup.children[2] as RadioButton).checked).toBeTrue();
        });

        it('updates bound property when selected value is changed', () => {
            setSelectedRadioIndex(radioGroup, 2);
            fixture.detectChanges();

            expect(testHostComponent.selectedRadioButton.value).toBe(testHostComponent.radioButtons[2].value);
        });
    });
});
