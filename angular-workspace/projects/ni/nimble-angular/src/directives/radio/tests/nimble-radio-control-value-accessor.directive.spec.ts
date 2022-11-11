import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NimbleRadioModule } from '../nimble-radio.module';
import { processUpdates } from '../../../testing/async-helpers';
import { waitTask } from '../../../async-test-utilities';
import { NimbleRadioGroupModule } from '../../radio-group/nimble-radio-group.module';
import type { RadioGroup } from '../../radio-group/nimble-radio-group.directive';
import type { Radio } from '../nimble-radio.directive';

function setSelectedRadioIndex(radioGroup: RadioGroup, index: number): void {
    radioGroup.children[index].dispatchEvent(new Event('click', { bubbles: true }));
}

describe('Nimble radio control value accessor', () => {
    describe('when using a template-based form', () => {
        @Component({
            template: `
                <nimble-radio-group #radioGroup name="options">
                    <nimble-radio *ngFor="let button of radios" [value]="button.value" [(ngModel)]="selectedRadio">
                        {{ button.name }}
                    </nimble-radio>
                </nimble-radio-group>
             `
        })
        class TestHostComponent {
            @ViewChild('radioGroup', { static: true }) public radioGroup: ElementRef<RadioGroup>;

            public radios: { name: string, value: unknown }[] = [
                { name: 'Option 1', value: 1 },
                { name: 'Option 2', value: 2 },
                { name: 'Option 3', value: 3 }
            ];

            public selectedRadio: unknown = this.radios[1].value;
        }

        let radioGroup: RadioGroup;
        let fixture: ComponentFixture<TestHostComponent>;
        let testHostComponent: TestHostComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRadioGroupModule, NimbleRadioModule, FormsModule, ReactiveFormsModule]
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
            expect((radioGroup.children[1] as Radio).checked).toBeTrue();
        });

        it('checks radio upon re-adding it', async () => {
            const secondRadio = radioGroup.children[1] as Radio;
            secondRadio.remove();
            fixture.detectChanges();
            await waitTask();

            expect((radioGroup.children[0] as Radio).checked).toBeFalse();
            expect((radioGroup.children[1] as Radio).checked).toBeFalse();

            secondRadio.checked = false;
            radioGroup.append(secondRadio);
            fixture.detectChanges();
            await waitTask();

            expect((radioGroup.children[2] as Radio).checked).toBeTrue();
        });

        it('updates selected value when bound property is changed', fakeAsync(() => {
            testHostComponent.selectedRadio = testHostComponent.radios[2].value;
            fixture.detectChanges();
            tick();
            processUpdates();

            expect((radioGroup.children[0] as Radio).checked).toBeFalse();
            expect((radioGroup.children[1] as Radio).checked).toBeFalse();
            expect((radioGroup.children[2] as Radio).checked).toBeTrue();
        }));

        it('updates bound property when selected value is changed', () => {
            setSelectedRadioIndex(radioGroup, 2);
            fixture.detectChanges();

            expect(testHostComponent.selectedRadio).toBe(testHostComponent.radios[2].value);
        });
    });

    describe('when using a reactive form', () => {
        @Component({
            template: `
                <form [formGroup]="form">
                    <nimble-radio-group #radioGroup>
                        <nimble-radio *ngFor="let option of radios" [value]="option.value" [formControl]="selectedRadio">
                            {{ option.name }}
                        </nimble-radio>
                    </nimble-radio-group>
                </form>
                `
        })
        class TestHostComponent {
            @ViewChild('radioGroup', { static: true }) public radioGroup: ElementRef<RadioGroup>;

            public radios: { name: string, value: unknown }[] = [
                { name: 'Option 1', value: 1 },
                { name: 'Option 2', value: 2 },
                { name: 'Option 3', value: 3 }
            ];

            public selectedRadio = new FormControl(this.radios[1].value);
            public form: FormGroup = new FormGroup({
                selectedRadio: this.selectedRadio
            });
        }

        let radioGroup: RadioGroup;
        let fixture: ComponentFixture<TestHostComponent>;
        let testHostComponent: TestHostComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRadioGroupModule, NimbleRadioModule, ReactiveFormsModule]
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
            expect((radioGroup.children[1] as Radio).checked).toBeTrue();
        });

        it('updates selected value when bound property is changed', fakeAsync(() => {
            testHostComponent.selectedRadio.setValue(testHostComponent.radios[2].value);
            fixture.detectChanges();
            tick();
            processUpdates();

            expect((radioGroup.children[0] as Radio).checked).toBeFalse();
            expect((radioGroup.children[1] as Radio).checked).toBeFalse();
            expect((radioGroup.children[2] as Radio).checked).toBeTrue();
        }));

        it('updates bound property when selected value is changed', () => {
            setSelectedRadioIndex(radioGroup, 2);
            fixture.detectChanges();

            expect(testHostComponent.selectedRadio.value).toBe(testHostComponent.radios[2].value);
        });
    });
});
