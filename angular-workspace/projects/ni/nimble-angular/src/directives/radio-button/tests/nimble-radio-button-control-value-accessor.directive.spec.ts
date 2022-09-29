import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NimbleRadioButtonModule } from '../nimble-radio-button.module';
import { processUpdates } from '../../../testing/async-helpers';
import { waitTask } from '../../../async-test-utilities';
import { NimbleRadioGroupModule } from '../../radio-group/nimble-radio-group.module';
import type { RadioGroup } from '../../radio-group/nimble-radio-group.directive';
import type { RadioButton } from '../nimble-radio-button.directive';

function setSelectedRadioIndex(radioGroup: RadioGroup, index: number): void {
    radioGroup.children[index].dispatchEvent(new Event('click', { bubbles: true }));
}

describe('Nimble radio button control value accessor', () => {
    describe('when using a template-based form', () => {
        @Component({
            template: `
                <nimble-radio-group #radioGroup name="options">
                    <nimble-radio-button *ngFor="let button of radioButtons" [value]="button.value" [(ngModel)]="selectedRadioButton">
                        {{ button.name }}
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

            public selectedRadioButton: unknown = this.radioButtons[1].value;
        }

        let radioGroup: RadioGroup;
        let fixture: ComponentFixture<TestHostComponent>;
        let testHostComponent: TestHostComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRadioGroupModule, NimbleRadioButtonModule, FormsModule, ReactiveFormsModule]
            });
        });

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestHostComponent);
            testHostComponent = fixture.componentInstance;
            radioGroup = testHostComponent.radioGroup.nativeElement;
            fixture.detectChanges();
            await waitTask();
        });

        afterEach(() => {
            processUpdates();
        });

        it('sets correct initial selected value', () => {
            expect((radioGroup.children[1] as RadioButton).checked).toBeTrue();
        });

        it('checks button upon re-adding it', async () => {
            const secondRadioButton = radioGroup.children[1] as RadioButton;
            secondRadioButton.remove();
            fixture.detectChanges();
            await waitTask();

            expect((radioGroup.children[0] as RadioButton).checked).toBeFalse();
            expect((radioGroup.children[1] as RadioButton).checked).toBeFalse();

            secondRadioButton.checked = false;
            radioGroup.append(secondRadioButton);
            fixture.detectChanges();
            await waitTask();

            expect((radioGroup.children[2] as RadioButton).checked).toBeTrue();
        });

        it('updates selected value when bound property is changed', fakeAsync(() => {
            testHostComponent.selectedRadioButton = testHostComponent.radioButtons[2].value;
            fixture.detectChanges();
            tick();
            processUpdates();

            expect((radioGroup.children[2] as RadioButton).checked).toBeTrue();
        }));

        it('updates bound property when selected value is changed', () => {
            setSelectedRadioIndex(radioGroup, 2);
            fixture.detectChanges();

            expect(testHostComponent.selectedRadioButton).toBe(testHostComponent.radioButtons[2].value);
        });
    });

    describe('when using a reactive form', () => {
        @Component({
            template: `
                <form [formGroup]="form">
                    <nimble-radio-group #radioGroup>
                        <nimble-radio-button *ngFor="let option of radioButtons" [value]="option.value" [formControl]="selectedRadioButton">
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
            await waitTask();
        });

        afterEach(() => {
            processUpdates();
        });

        it('sets correct initial selected value', () => {
            expect((radioGroup.children[1] as RadioButton).checked).toBeTrue();
        });

        it('updates selected value when bound property is changed', fakeAsync(() => {
            testHostComponent.selectedRadioButton.setValue(testHostComponent.radioButtons[2].value);
            fixture.detectChanges();
            tick();
            processUpdates();

            expect((radioGroup.children[2] as RadioButton).checked).toBeTrue();
        }));

        it('updates bound property when selected value is changed', () => {
            setSelectedRadioIndex(radioGroup, 2);
            fixture.detectChanges();

            expect(testHostComponent.selectedRadioButton.value).toBe(testHostComponent.radioButtons[2].value);
        });
    });
});
