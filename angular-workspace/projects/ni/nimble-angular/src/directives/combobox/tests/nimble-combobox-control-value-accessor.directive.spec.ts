import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NimbleComboboxModule } from '../nimble-combobox.module';
import { NimbleListOptionModule } from '../../list-option/nimble-list-option.module';
import { waitTask } from '../../../async-test-utilities';
import { processUpdates } from '../../../testing/async-helpers';
import type { Combobox } from '../nimble-combobox.directive';
import { notFoundSymbol } from '../nimble-combobox-control-value-accessor.directive';

function setComboboxValue(combobox: Combobox, index: number): void {
    combobox.dispatchEvent(new Event('click'));
    combobox.options[index].dispatchEvent(new Event('click', { bubbles: true }));
}

describe('Nimble combobox control value accessor', () => {
    describe('when using option\'s [ngValue] binding', () => {
        @Component({
            template: `
                <nimble-combobox #combobox [(ngModel)]="selectedOption" (ngModelChange)="onModelValueChange($event)" [compareWith]="compareWith" [disabled]="selectDisabled">                    
                    <nimble-list-option *ngFor="let option of selectOptions" [ngValue]="option">{{ option.name }}</nimble-list-option>
                </nimble-combobox>
             `
        })
        class TestHostComponent {
            @ViewChild('combobox', { static: true }) public combobox: ElementRef<Combobox>;

            public selectOptions: { name: string, value: number }[] = [
                { name: 'Option 1', value: 1 },
                { name: 'Option 2', value: 2 },
                { name: 'Option 3', value: 3 }
            ];

            public selectedOption: { name: string, value: number } | unknown = this.selectOptions[1];

            public selectDisabled = false;

            public callbackValue: unknown;

            public useDefaultOptions = true;

            public compareWith(option1: { name: string, value: number } | null, option2: { name: string, value: number } | null): boolean {
                return !!option1 && !!option2 && option1.value === option2.value;
            }

            public onModelValueChange(value: { name: string, value: number } | unknown): void {
                this.callbackValue = value;
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
            // wait for combobox's 'options' property to be updated from slotted content
            await waitTask();
        });

        afterEach(() => {
            processUpdates();
        });

        it('sets correct initial selected value', () => {
            expect(testHostComponent.selectedOption).toBe(testHostComponent.selectOptions[1]);
            expect(combobox.selectedIndex).toBe(1);
        });

        it('updates selected value when bound property is changed', fakeAsync(() => {
            testHostComponent.selectedOption = testHostComponent.selectOptions[2];
            fixture.detectChanges();
            tick();

            expect(combobox.selectedIndex).toBe(2);
        }));

        it('updates bound property when selected value is changed', () => {
            setComboboxValue(combobox, 2);
            fixture.detectChanges();

            expect(testHostComponent.selectedOption).toBe(testHostComponent.selectOptions[2]);
        });

        it('uses "compareWith" function to determine value equality', fakeAsync(() => {
            // copy object to test equality checking
            const newValue = JSON.parse(JSON.stringify(testHostComponent.selectOptions[2])) as { name: string, value: number };
            testHostComponent.selectedOption = newValue;
            fixture.detectChanges();
            tick();

            expect(combobox.selectedIndex).toBe(2);
        }));

        it('sets "disabled" attribute with value of bound property', fakeAsync(() => {
            testHostComponent.selectDisabled = true;
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(combobox.getAttribute('disabled')).toBe('');
            expect(combobox.disabled).toBe(true);
        }));

        it('sets text to empty string for model value not in list options', fakeAsync(() => {
            expect(combobox.control.value).toEqual('Option 2');
            testHostComponent.selectedOption = { name: 'foo', value: 4 };
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(combobox.control.value).toEqual('');
        }));

        it('list-option with current combobox value is removed, combobox display value is unchanged', fakeAsync(() => {
            testHostComponent.selectOptions.splice(1, 1);
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(combobox.control.value).toEqual('Option 2');
        }));

        it('list-option is removed followed by text of removed option entered as value, then \'testHostComponent.selectedOption\' is set to notFoundSymbol', fakeAsync(() => {
            testHostComponent.selectOptions.splice(0, 1); // remove 'Option 1'
            fixture.detectChanges();
            tick();
            processUpdates();

            combobox.control.value = 'Option 1';
            combobox.control.dispatchEvent(new InputEvent('input', { data: 'Option 1', inputType: 'insertText' }));
            combobox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(testHostComponent.selectedOption).toEqual(notFoundSymbol);
        }));

        // TODO: enable test when FAST Issue #6111 (https://github.com/microsoft/fast/issues/6111) is addressed
        xit('and user enters aribtrary text for value, callback value is notFoundSymbol', () => {
            combobox.control.value = 'f';
            combobox.control.dispatchEvent(new InputEvent('input', { data: 'f', inputType: 'insertText' }));
            combobox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            fixture.detectChanges();

            expect(testHostComponent.callbackValue).toEqual(notFoundSymbol);
        });
    });

    describe('when using option\'s [value] binding', () => {
        @Component({
            template: `
                <nimble-combobox #combobox [(ngModel)]="selectedOption">
                    <nimble-list-option *ngFor="let option of selectOptions"
                        [value]="option.name">
                        {{ option.name }}
                    </nimble-list-option>
                </nimble-combobox>
             `
        })
        class TestHostComponent {
            @ViewChild('combobox', { static: true }) public combobox: ElementRef<Combobox>;

            public selectOptions: { name: string, value: number }[] = [
                { name: 'Option 1', value: 1 },
                { name: 'Option 2', value: 2 },
                { name: 'Option 3', value: 3 }
            ];

            public selectedOption: string | unknown = this.selectOptions[1].name.toString();
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
            // wait for combobox's 'options' property to be updated from slotted content
            await waitTask();
        });

        afterEach(() => {
            processUpdates();
        });

        it('sets correct initial selected value', () => {
            expect(testHostComponent.selectedOption).toBe(testHostComponent.selectOptions[1].name.toString());
            expect(combobox.selectedIndex).toBe(1);
        });

        it('updates selected value when bound property is changed', fakeAsync(() => {
            testHostComponent.selectedOption = testHostComponent.selectOptions[2].name.toString();
            fixture.detectChanges();
            tick();

            expect(combobox.selectedIndex).toBe(2);
        }));

        it('updates bound property when selected value is changed', () => {
            setComboboxValue(combobox, 2);
            fixture.detectChanges();

            expect(testHostComponent.selectedOption).toBe(testHostComponent.selectOptions[2].name.toString());
        });

        // TODO: enable test when FAST Issue #6111 (https://github.com/microsoft/fast/issues/6111) is addressed
        it('updates bound property to notFoundSymbol when \'foo\' entered', () => {
            combobox.control.value = 'foo';
            combobox.control.dispatchEvent(new InputEvent('input', { data: 'foo', inputType: 'insertText' }));
            combobox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            fixture.detectChanges();

            expect(testHostComponent.selectedOption).toEqual(notFoundSymbol);
        });
    });
});
