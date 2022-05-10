import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import type { Combobox } from '@ni/nimble-components/dist/esm/combobox';
import { NimbleComboboxModule } from '../nimble-combobox.module';
import { NimbleListOptionModule } from '../../list-option/nimble-list-option.module';
import { waitTask } from '../../../async-test-utilities';
import { processUpdates } from '../../../testing/async-helpers';

function setComboboxValue(combobox: Combobox, index: number): void {
    combobox.dispatchEvent(new Event('click'));
    combobox.options[index].dispatchEvent(new Event('click', { bubbles: true }));
}

describe('Nimble combobox control value accessor', () => {
    describe('when using option\'s [ngValue] binding', () => {
        @Component({
            template: `
                <nimble-combobox #combobox [(ngModel)]="selectedOption" [compareWith]="compareWith" [disabled]="comboboxDisabled">
                    <nimble-list-option *ngFor="let option of comboboxOptions"
                        [ngValue]="option">
                        {{ option.name }}
                    </nimble-list-option>
                </nimble-combobox>
             `
        })
        class TestHostComponent {
            @ViewChild('combobox', { static: true }) public combobox: ElementRef<Combobox>;

            public comboboxOptions: { name: string, value: number }[] = [
                { name: 'Option 1', value: 1 },
                { name: 'Option 2', value: 2 },
                { name: 'Option 3', value: 3 }
            ];

            public selectedOption = this.comboboxOptions[1];

            public comboboxDisabled = false;

            public compareWith(option1: { name: string, value: number } | null, option2: { name: string, value: number } | null): boolean {
                return !!option1 && !!option2 && option1.value === option2.value;
            }
        }

        let combobox: Combobox;
        let fixture: ComponentFixture<TestHostComponent>;
        let testHostComponent: TestHostComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleComboboxModule, NimbleListOptionModule, FormsModule]
            });
        });

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestHostComponent);
            testHostComponent = fixture.componentInstance;
            combobox = testHostComponent.combobox.nativeElement;
            fixture.detectChanges();
            // wait for select's 'options' property to be updated from slotted content
            await waitTask();
        });

        afterEach(() => {
            processUpdates();
        });

        it('sets correct initial selected value', () => {
            expect(testHostComponent.selectedOption).toBe(testHostComponent.comboboxOptions[1]);
            expect(combobox.selectedIndex).toBe(1);
        });

        it('updates selected value when bound property is changed', fakeAsync(() => {
            testHostComponent.selectedOption = testHostComponent.comboboxOptions[2];
            fixture.detectChanges();
            tick();

            expect(combobox.selectedIndex).toBe(2);
        }));

        it('updates bound property when selected value is changed', () => {
            setComboboxValue(combobox, 2);
            fixture.detectChanges();

            expect(testHostComponent.selectedOption).toBe(testHostComponent.comboboxOptions[2]);
        });

        it('uses "compareWith" function to determine value equality', fakeAsync(() => {
            // copy object to test equality checking
            const newValue = JSON.parse(JSON.stringify(testHostComponent.comboboxOptions[2])) as { name: string, value: number };
            testHostComponent.selectedOption = newValue;
            fixture.detectChanges();
            tick();

            expect(combobox.selectedIndex).toBe(2);
        }));

        it('sets "disabled" attribute with value of bound property', fakeAsync(() => {
            testHostComponent.comboboxDisabled = true;
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(combobox.getAttribute('disabled')).toBe('');
            expect(combobox.disabled).toBe(true);
        }));
    });

    describe('when using option\'s [value] binding', () => {
        @Component({
            template: `
                <nimble-combobox #select [(ngModel)]="selectedOption">
                    <nimble-list-option *ngFor="let option of comboboxOptions"
                        [value]="option.value">
                        {{ option.name }}
                    </nimble-list-option>
                </nimble-combobox>
             `
        })
        class TestHostComponent {
            @ViewChild('combobox', { static: true }) public combobox: ElementRef<Combobox>;

            public comboboxOptions: { name: string, value: number }[] = [
                { name: 'Option 1', value: 1 },
                { name: 'Option 2', value: 2 },
                { name: 'Option 3', value: 3 }
            ];

            public selectedOption = this.comboboxOptions[1].value.toString();
        }

        let combobox: Combobox;
        let fixture: ComponentFixture<TestHostComponent>;
        let testHostComponent: TestHostComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleComboboxModule, NimbleListOptionModule, FormsModule]
            });
        });

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestHostComponent);
            testHostComponent = fixture.componentInstance;
            combobox = testHostComponent.combobox.nativeElement;
            fixture.detectChanges();
            // wait for select's 'options' property to be updated from slotted content
            await waitTask();
        });

        afterEach(() => {
            processUpdates();
        });

        it('sets correct initial selected value', () => {
            expect(testHostComponent.selectedOption).toBe(testHostComponent.comboboxOptions[1].value.toString());
            expect(combobox.selectedIndex).toBe(1);
        });

        it('updates selected value when bound property is changed', fakeAsync(() => {
            testHostComponent.selectedOption = testHostComponent.comboboxOptions[2].value.toString();
            fixture.detectChanges();
            tick();

            expect(combobox.selectedIndex).toBe(2);
        }));

        it('updates bound property when selected value is changed', () => {
            setComboboxValue(combobox, 2);
            fixture.detectChanges();

            expect(testHostComponent.selectedOption).toBe(testHostComponent.comboboxOptions[2].value.toString());
        });
    });
});
