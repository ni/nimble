import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NimbleComboboxModule } from '../nimble-combobox.module';
import { NimbleListOptionModule } from '../../list-option/nimble-list-option.module';
import { waitTask } from '../../../async-test-utilities';
import { processUpdates } from '../../../testing/async-helpers';
import type { Combobox } from '../nimble-combobox.directive';
import { OptionNotFound, OPTION_NOT_FOUND } from '../nimble-combobox-control-value-accessor.directive';

function setComboboxValue(combobox: Combobox, index: number): void {
    combobox.dispatchEvent(new Event('click'));
    combobox.options[index].dispatchEvent(new Event('click', { bubbles: true }));
}

describe('Nimble combobox control value accessor', () => {
    describe('when using option\'s [ngValue] binding', () => {
        @Component({
            template: `
                <nimble-combobox #combobox [(ngModel)]="selectedOption" (ngModelChange)="onModelValueChange($event)" [compareWith]="compareWith" [disabled]="selectDisabled">                    
                    <nimble-list-option *ngFor="let option of selectOptions" [ngValue]="option">{{ option?.name ?? nullValueString }}</nimble-list-option>
                    <nimble-list-option [ngValue]="dynamicOption">{{ dynamicOption?.name }}</nimble-list-option>
                </nimble-combobox>
             `
        })
        class TestHostComponent {
            @ViewChild('combobox', { static: true }) public combobox: ElementRef<Combobox>;

            public selectOptions: ({ name: string, value: number } | null)[] = [
                { name: 'Option 1', value: 1 },
                { name: 'Option 2', value: 2 },
                { name: 'Option 3', value: 3 },
                null
            ];

            public selectedOption: { name: string, value: number } | null | OptionNotFound = this.selectOptions[1];
            public dynamicOption: { name: string, value: number } = { name: 'Dynamic Option 1', value: 4 };
            public readonly nullValueString = 'null';

            public selectDisabled = false;

            public callbackValue: { name: string, value: number } | OptionNotFound;

            public useDefaultOptions = true;

            public compareWith(option1: { name: string, value: number } | null, option2: { name: string, value: number } | null): boolean {
                return (!!option1 && !!option2 && option1.value === option2.value) || (option1 === null && option2 === null);
            }

            public onModelValueChange(value: { name: string, value: number } | OptionNotFound): void {
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
            testHostComponent.selectedOption = { name: 'foo', value: 5 };
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

        it('model changes for option, then option selected, combobox display value uses text from new model value', fakeAsync(() => {
            testHostComponent.dynamicOption = { name: 'foo', value: 10 };
            fixture.detectChanges();
            tick();
            processUpdates();
            testHostComponent.selectedOption = testHostComponent.dynamicOption;
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(combobox.control.value).toEqual('foo');
        }));

        it('null option is selected, combobox display value is set to provided display string for null', fakeAsync(() => {
            setComboboxValue(combobox, 3); // select null option
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(combobox.control.value).toEqual(testHostComponent.nullValueString);
        }));

        it('set bound value to null, combobox selectedIndex set to option with null value', fakeAsync(() => {
            testHostComponent.selectedOption = null;
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(combobox.selectedIndex).toEqual(3);
            expect(combobox.control.value).toEqual(testHostComponent.nullValueString);
        }));

        it('model changes for option, text display of old option entered, callback value is notFound ', fakeAsync(() => {
            testHostComponent.dynamicOption = { name: 'foo', value: 10 };
            fixture.detectChanges();
            tick();
            processUpdates();
            combobox.control.value = 'Dynamic Option 1';
            combobox.control.dispatchEvent(new InputEvent('input', { data: 'Dynamic Option 1', inputType: 'insertText' }));
            combobox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(testHostComponent.callbackValue).toEqual(OPTION_NOT_FOUND);
        }));

        it('list-option is removed followed by text of removed option entered as value, then \'testHostComponent.selectedOption\' is set to notFound', fakeAsync(() => {
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

            expect(testHostComponent.selectedOption).toEqual(OPTION_NOT_FOUND);
        }));

        it('and user enters aribtrary text for value, callback value is notFound', () => {
            combobox.control.value = 'f';
            combobox.control.dispatchEvent(new InputEvent('input', { data: 'f', inputType: 'insertText' }));
            combobox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            fixture.detectChanges();

            expect(testHostComponent.callbackValue).toEqual(OPTION_NOT_FOUND);
        });
    });
});
