import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NimbleComboboxModule } from '../nimble-combobox.module';
import { NimbleListOptionModule } from '../../list-option/nimble-list-option.module';
import { processUpdates, waitForUpdatesAsync } from '../../../testing/async-helpers';
import type { Combobox } from '../nimble-combobox.directive';
import { OptionNotFound, OPTION_NOT_FOUND } from '../nimble-combobox-control-value-accessor.directive';
import type { ListOption } from '../../../public-api';

function clickOnListOption(combobox: Combobox, index: number): void {
    combobox.dispatchEvent(new Event('click'));
    combobox.options[index].dispatchEvent(new Event('click', { bubbles: true }));
}

function updateComboboxWithText(combobox: Combobox, text: string): void {
    combobox.control.value = text;
    const inputEvent = new InputEvent('input', { data: text, inputType: 'insertText' });
    combobox.inputHandler(inputEvent);
    combobox.dispatchEvent(inputEvent);
}

interface TestModel {
    name: string;
    otherName?: string;
    value: number;
}

describe('Nimble combobox control value accessor', () => {
    describe('when using option\'s [ngValue] binding on template-based form', () => {
        @Component({
            template: `
                <nimble-combobox #combobox [(ngModel)]="selectedOption" (ngModelChange)="onModelValueChange($event)" [compareWith]="compareWith" [disabled]="selectDisabled" autocomplete="none">
                    <nimble-list-option *ngFor="let option of selectOptions" [ngValue]="option">{{ option?.name ?? nullValueString }}</nimble-list-option>
                    <nimble-list-option [ngValue]="dynamicOption">{{ dynamicOption?.name }}</nimble-list-option>
                    <nimble-list-option *ngIf="showFirstSharedOption" [ngValue]="sharedOption">{{ sharedOption?.name }}</nimble-list-option>
                    <nimble-list-option #lastOption [ngValue]="sharedOption">{{ sharedOption?.otherName }}</nimble-list-option>
                </nimble-combobox>
             `
        })
        class TestHostComponent {
            @ViewChild('combobox', { static: true }) public combobox: ElementRef<Combobox>;
            @ViewChild('lastOption', { static: true }) public lastOption: ElementRef<ListOption>;

            public selectOptions: (TestModel | null)[] = [
                { name: 'Duplicate Option 1', value: 1 },
                { name: 'Duplicate Option 1', value: 100 },
                { name: 'Option 2', value: 2 },
                { name: ' Option 3 ', value: 3 }, // keep whitespace around name for test
                null
            ];

            public defaultSelection = this.selectOptions[2];
            public selectedOption: TestModel | null | OptionNotFound = this.defaultSelection;
            public dynamicOption: TestModel = { name: 'Dynamic Option 1', value: 4 };
            public sharedOption: TestModel = { name: 'Shared Option 1', otherName: 'Shared Option 2', value: 1 };
            public readonly nullValueString = 'null';

            public selectDisabled = false;
            public showFirstSharedOption = true;

            public callbackValue: TestModel | OptionNotFound;

            public useDefaultOptions = true;

            public compareWith(option1: TestModel | null, option2: TestModel | null): boolean {
                return (!!option1 && !!option2 && option1.value === option2.value) || (option1 === null && option2 === null);
            }

            public onModelValueChange(value: TestModel | OptionNotFound): void {
                this.callbackValue = value;
            }
        }

        let combobox: Combobox;
        let lastOption: ListOption;
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
            lastOption = testHostComponent.lastOption.nativeElement;
            fixture.detectChanges();
            // wait for combobox's 'options' property to be updated from slotted content
            await waitForUpdatesAsync();
        });

        afterEach(() => {
            processUpdates();
        });

        it('sets correct initial selected value', () => {
            expect(testHostComponent.selectedOption).toBe(testHostComponent.defaultSelection);
            expect(combobox.selectedIndex).toBe(2);
        });

        it('updates selected value when bound property is changed', async () => {
            testHostComponent.selectedOption = testHostComponent.selectOptions[0];
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.selectedIndex).toBe(0);
        });

        it('updates bound property when selected value is changed', () => {
            clickOnListOption(combobox, 3);
            fixture.detectChanges();

            expect(testHostComponent.selectedOption).toBe(testHostComponent.selectOptions[3]);
        });

        it('supports options with whitespace at beginning or end of textContent', () => {
            clickOnListOption(combobox, 3);
            fixture.detectChanges();

            expect(testHostComponent.selectedOption).toBe(testHostComponent.selectOptions[3]);
        });

        it('uses "compareWith" function to determine value equality', async () => {
            // copy object to test equality checking
            const newValue = JSON.parse(JSON.stringify(testHostComponent.selectOptions[2])) as TestModel;
            testHostComponent.selectedOption = newValue;
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.selectedIndex).toBe(2);
        });

        it('sets "disabled" attribute with value of bound property', async () => {
            testHostComponent.selectDisabled = true;
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.getAttribute('disabled')).toBe('');
            expect(combobox.disabled).toBe(true);
        });

        it('sets text to empty string for model value not in list options', async () => {
            const modelValueNotInList: TestModel = { name: 'foo', value: 5 };
            testHostComponent.selectedOption = modelValueNotInList;
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.control.value).toEqual('');
            expect(testHostComponent.selectedOption).toBe(modelValueNotInList);
        });

        it('list-option with current combobox value is removed, combobox display value is unchanged', async () => {
            const currentValue = testHostComponent.defaultSelection;
            testHostComponent.selectOptions.splice(1, 1);
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.control.value).toEqual('Option 2');
            expect(testHostComponent.selectedOption).toBe(currentValue);
        });

        it('model changes for option, then option selected, combobox display value uses text from new model value', async () => {
            testHostComponent.dynamicOption = { name: 'foo', value: 10 };
            fixture.detectChanges();
            await waitForUpdatesAsync();
            testHostComponent.selectedOption = testHostComponent.dynamicOption;
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.control.value).toEqual('foo');
            expect(testHostComponent.selectedOption).toBe(testHostComponent.dynamicOption);
        });

        it('text is changed in DOM for selected option, combobox display text and model value are unchanged', async () => {
            const lastOptionInitialText = lastOption.text;
            clickOnListOption(combobox, 7); // select last option (sharedOption)
            fixture.detectChanges();
            lastOption.textContent = 'Option 2';
            await waitForUpdatesAsync();

            expect(testHostComponent.selectedOption).toBe(testHostComponent.sharedOption);
            expect(combobox.control.value).toBe(lastOptionInitialText);
        });

        it('text is changed in DOM for non-selected option, when changed option is selected, combobox display text matches DOM', async () => {
            lastOption.textContent = 'foo';
            await waitForUpdatesAsync();
            clickOnListOption(combobox, 7); // select last option (sharedOption)
            fixture.detectChanges();

            expect(testHostComponent.selectedOption).toBe(testHostComponent.sharedOption);
            expect(combobox.control.value).toBe('foo');
        });

        it('null option is selected, combobox display value is set to provided display string for null', async () => {
            clickOnListOption(combobox, 4); // select null option
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.control.value).toEqual(testHostComponent.nullValueString);
            expect(testHostComponent.selectedOption).toBe(null);
        });

        it('set bound value to null, combobox selectedIndex set to option with null value', async () => {
            testHostComponent.selectedOption = null;
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.selectedIndex).toEqual(4);
            expect(combobox.control.value).toEqual(testHostComponent.nullValueString);
            expect(testHostComponent.selectedOption).toBe(null);
        });

        it('model changes for option, text display of old option entered, callback value is notFound', async () => {
            testHostComponent.dynamicOption = { name: 'foo', value: 10 };
            fixture.detectChanges();
            await waitForUpdatesAsync();
            updateComboboxWithText(combobox, 'Dynamic Option 1');
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(testHostComponent.callbackValue).toEqual(OPTION_NOT_FOUND);
        });

        it('list-option is removed followed by text of removed option entered as value, then \'testHostComponent.selectedOption\' is set to notFound', async () => {
            testHostComponent.selectOptions = testHostComponent.selectOptions.filter((_, i) => i !== 2);
            fixture.detectChanges();
            await waitForUpdatesAsync();

            updateComboboxWithText(combobox, 'Option 2');
            fixture.detectChanges();

            expect(testHostComponent.selectedOption).toEqual(OPTION_NOT_FOUND);
        });

        it('as user types, selectedOption value is updated', () => {
            updateComboboxWithText(combobox, 'f');
            fixture.detectChanges();

            expect(testHostComponent.selectedOption).toEqual(OPTION_NOT_FOUND);

            updateComboboxWithText(combobox, 'Option 2');
            fixture.detectChanges();

            expect(testHostComponent.selectedOption).toEqual(testHostComponent.selectOptions[2]);
        });

        it('selecting duplicate value results in expected text in display', async () => {
            clickOnListOption(combobox, 1); // select second duplicate display value
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.control.value).toEqual(testHostComponent.selectOptions[1]!.name);
        });

        it('selecting duplicate value finds first model value associated with that display value', async () => {
            clickOnListOption(combobox, 1); // select last duplicate display value
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(testHostComponent.selectedOption).toEqual(testHostComponent.selectOptions[0]);
        });

        it('setting bound model value to duplicate value, updates display text', async () => {
            testHostComponent.selectedOption = testHostComponent.selectOptions[0]; // first duplicate value
            fixture.detectChanges();
            await waitForUpdatesAsync();
            expect(combobox.value).toBe(testHostComponent.selectOptions[0]!.name);
            testHostComponent.selectedOption = testHostComponent.selectOptions[1]; // second duplicate value
            fixture.detectChanges();
            await waitForUpdatesAsync();
            expect(combobox.value).toBe(testHostComponent.selectOptions[1]!.name);
        });

        it('removing first duplicate value from DOM allows selection of now unduplicated value', async () => {
            testHostComponent.selectOptions = testHostComponent.selectOptions.filter((_, i) => i !== 0);
            fixture.detectChanges();
            await waitForUpdatesAsync();
            clickOnListOption(combobox, 0); // select unduplicated option
            fixture.detectChanges();
            processUpdates();

            expect(testHostComponent.selectedOption).toBe(testHostComponent.selectOptions[0]);
        });

        it('can select different options with the same model value', () => {
            clickOnListOption(combobox, 6); // select first option with shared model value
            fixture.detectChanges();
            processUpdates();
            expect(testHostComponent.selectedOption).toBe(testHostComponent.sharedOption);
            expect(combobox.value).toBe('Shared Option 1');
            clickOnListOption(combobox, 7); // select second option with shared model value
            fixture.detectChanges();
            processUpdates();
            expect(testHostComponent.selectedOption).toBe(testHostComponent.sharedOption);
            expect(combobox.value).toBe('Shared Option 2');
        });

        it('can still select one shared option after removing the other', async () => {
            testHostComponent.showFirstSharedOption = false;
            fixture.detectChanges();
            await waitForUpdatesAsync();
            clickOnListOption(combobox, 6); // select now lone option with the assigned model
            fixture.detectChanges();
            processUpdates();

            expect(testHostComponent.selectedOption).toBe(testHostComponent.sharedOption);
            expect(combobox.value).toBe('Shared Option 2');
        });

        it('update option value with new model, followed by updating combobox value with same model updates display correctly', async () => {
            const newModelValue: TestModel = { name: 'newName', value: 101 };
            testHostComponent.dynamicOption = newModelValue;
            testHostComponent.selectedOption = newModelValue;
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.value).toBe('newName');
        });

        it('combobox supports a large amount of options', () => {
            const newOptions: TestModel[] = [];
            for (let i = 0; i < 300; i++) {
                newOptions.push({ name: i.toString(), value: i });
            }
            testHostComponent.selectOptions = newOptions;
            expect(() => {
                fixture.detectChanges();
            }).not.toThrow();
        });
    });

    describe('when using option\'s [ngValue] binding on Reactive form', () => {
        @Component({
            template: `
                <form [formGroup]="form">
                    <nimble-combobox #combobox [formControl]="selectedOption" [compareWith]="compareWith" autocomplete="none">
                        <nimble-list-option *ngFor="let option of selectOptions" [ngValue]="option">{{ option?.name ?? nullValueString }}</nimble-list-option>
                        <nimble-list-option [ngValue]="dynamicOption">{{ dynamicOption?.name }}</nimble-list-option>
                        <nimble-list-option *ngIf="showFirstSharedOption" [ngValue]="sharedOption">{{ sharedOption?.name }}</nimble-list-option>
                        <nimble-list-option #lastOption [ngValue]="sharedOption">{{ sharedOption?.otherName }}</nimble-list-option>
                    </nimble-combobox>
                </form>
             `
        })
        class TestHostComponent {
            @ViewChild('combobox', { static: true }) public combobox: ElementRef<Combobox>;
            @ViewChild('lastOption', { static: true }) public lastOption: ElementRef<ListOption>;

            public selectOptions: (TestModel | null)[] = [
                { name: 'Duplicate Option 1', value: 1 },
                { name: 'Duplicate Option 1', value: 100 },
                { name: 'Option 2', value: 2 },
                { name: ' Option 3 ', value: 3 }, // keep whitespace around name for test
                null
            ];

            public defaultOption = this.selectOptions[2];
            public selectedOption = new FormControl<TestModel | null | typeof OPTION_NOT_FOUND>(this.defaultOption);
            public form: FormGroup = new FormGroup({
                selectOption: this.selectedOption
            });

            public dynamicOption: TestModel = { name: 'Dynamic Option 1', value: 4 };
            public sharedOption: TestModel = { name: 'Shared Option 1', otherName: 'Shared Option 2', value: 1 };
            public readonly nullValueString = 'null';
            public showFirstSharedOption = true;

            public useDefaultOptions = true;

            public compareWith(option1: TestModel | null, option2: TestModel | null): boolean {
                return (!!option1 && !!option2 && option1.value === option2.value) || (option1 === null && option2 === null);
            }
        }

        let combobox: Combobox;
        let lastOption: ListOption;
        let fixture: ComponentFixture<TestHostComponent>;
        let testHostComponent: TestHostComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleComboboxModule, NimbleListOptionModule, ReactiveFormsModule]
            });
        });

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestHostComponent);
            testHostComponent = fixture.componentInstance;
            combobox = testHostComponent.combobox.nativeElement;
            lastOption = testHostComponent.lastOption.nativeElement;
            fixture.detectChanges();
            // wait for combobox's 'options' property to be updated from slotted content
            await waitForUpdatesAsync();
        });

        afterEach(() => {
            processUpdates();
        });

        it('sets correct initial selected value', () => {
            expect(testHostComponent.selectedOption.value).toBe(testHostComponent.defaultOption);
            expect(combobox.selectedIndex).toBe(2);
        });

        it('updates selected value when bound property is changed', async () => {
            testHostComponent.selectedOption.setValue(testHostComponent.selectOptions[0]);
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.selectedIndex).toBe(0);
        });

        it('updates bound property when selected value is changed', () => {
            clickOnListOption(combobox, 3);
            fixture.detectChanges();

            expect(testHostComponent.selectedOption.value).toBe(testHostComponent.selectOptions[3]);
        });

        it('supports options with whitespace at beginning or end of textContent', () => {
            clickOnListOption(combobox, 3);
            fixture.detectChanges();

            expect(testHostComponent.selectedOption.value).toBe(testHostComponent.selectOptions[3]);
        });

        it('uses "compareWith" function to determine value equality', async () => {
            const initialIndex = combobox.selectedIndex;
            // copy object to test equality checking
            const newValue = JSON.parse(JSON.stringify(testHostComponent.selectOptions[3])) as TestModel;
            testHostComponent.selectedOption.setValue(newValue);
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(initialIndex).toEqual(2);
            expect(combobox.selectedIndex).toEqual(3);
        });

        it('disables combobox when disable() is called on the form control', () => {
            testHostComponent.selectedOption.disable();
            processUpdates();

            expect(combobox.getAttribute('disabled')).toBe('');
            expect(combobox.disabled).toBe(true);
        });

        it('enables combobox when enable() is called on the form control', () => {
            combobox.disabled = true;
            processUpdates();

            testHostComponent.selectedOption.enable();
            processUpdates();

            expect(combobox.getAttribute('disabled')).toBe(null);
            expect(combobox.disabled).toBe(false);
        });

        it('sets text to empty string for model value not in list options but maintains set model value', async () => {
            expect(testHostComponent.selectedOption.value).toBe(testHostComponent.defaultOption);
            const valueNotInOptions = { name: 'foo', value: 5 };
            testHostComponent.selectedOption.setValue(valueNotInOptions);
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.control.value).toEqual('');
            expect(testHostComponent.selectedOption.value).toBe(valueNotInOptions);
        });

        it('list-option with current combobox value is removed, combobox display value and model value is unchanged', async () => {
            const currentModelValue = testHostComponent.selectedOption.value;
            testHostComponent.selectOptions.splice(1, 1); // removes currently selected option from set
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.control.value).toEqual('Option 2');
            expect(testHostComponent.selectedOption.value).toBe(currentModelValue);
        });

        it('model changes for option, then option selected, combobox display value uses text from new model value', async () => {
            testHostComponent.dynamicOption = { name: 'foo', value: 10 };
            fixture.detectChanges();
            await waitForUpdatesAsync();
            testHostComponent.selectedOption.setValue(testHostComponent.dynamicOption);
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.control.value).toEqual('foo');
            expect(testHostComponent.selectedOption.value).toBe(testHostComponent.dynamicOption);
        });

        it('text is changed in DOM for selected option, combobox display text and model value are unchanged', async () => {
            const lastOptionText = lastOption.text;
            clickOnListOption(combobox, 7); // select last option (sharedOption)
            fixture.detectChanges();
            lastOption.textContent = 'Option 2';
            await waitForUpdatesAsync();

            expect(testHostComponent.selectedOption.value).toBe(testHostComponent.sharedOption);
            expect(combobox.control.value).toBe(lastOptionText);
        });

        it('text is changed in DOM for non-selected option, when changed option is selected, combobox display text matches DOM', async () => {
            lastOption.textContent = 'foo';
            await waitForUpdatesAsync();
            clickOnListOption(combobox, 7); // select last option (sharedOption)
            fixture.detectChanges();

            expect(testHostComponent.selectedOption.value).toBe(testHostComponent.sharedOption);
            expect(combobox.control.value).toBe('foo');
        });

        it('null option is selected, combobox display value is set to provided display string for null', async () => {
            clickOnListOption(combobox, 4); // select null option
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.control.value).toEqual(testHostComponent.nullValueString);
            expect(testHostComponent.selectedOption.value).toBe(null);
        });

        it('set bound value to null, combobox selectedIndex set to option with null value', async () => {
            testHostComponent.selectedOption.setValue(null);
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.selectedIndex).toEqual(4);
            expect(combobox.control.value).toEqual(testHostComponent.nullValueString);
            expect(testHostComponent.selectedOption.value).toBe(null);
        });

        it('model changes for option, text display of old option entered, selectedOption value is OPTION_NOT_FOUND ', async () => {
            testHostComponent.dynamicOption = { name: 'foo', value: 10 };
            fixture.detectChanges();
            await waitForUpdatesAsync();
            updateComboboxWithText(combobox, 'Dynamic Option 1');
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(testHostComponent.selectedOption.value).toEqual(OPTION_NOT_FOUND);
        });

        it('list-option is removed followed by text of removed option entered as value, selectedOption value is OPTION_NOT_FOUND', async () => {
            testHostComponent.selectOptions.splice(2, 1); // remove 'Duplicate Option 1'
            fixture.detectChanges();
            await waitForUpdatesAsync();

            updateComboboxWithText(combobox, 'Option 2');
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(testHostComponent.selectedOption.value).toEqual(OPTION_NOT_FOUND);
        });

        it('as user types, selectedOption value is updated', () => {
            updateComboboxWithText(combobox, 'f');
            fixture.detectChanges();

            expect(testHostComponent.selectedOption.value).toEqual(OPTION_NOT_FOUND);

            updateComboboxWithText(combobox, 'Option 2');
            fixture.detectChanges();

            expect(testHostComponent.selectedOption.value).toEqual(testHostComponent.selectOptions[2]);
        });

        it('selecting duplicate value results in expected text in display', async () => {
            clickOnListOption(combobox, 1); // select second duplicate display value
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.control.value).toEqual(testHostComponent.selectOptions[1]!.name);
        });

        it('selecting duplicate value finds first model value associated with that display value', async () => {
            clickOnListOption(combobox, 1); // select second duplicate display value
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(testHostComponent.selectedOption.value).toEqual(testHostComponent.selectOptions[0]);
        });

        it('setting bound model value to duplicate value, updates display text', async () => {
            testHostComponent.selectedOption.setValue(testHostComponent.selectOptions[0]); // first duplicate value
            fixture.detectChanges();
            await waitForUpdatesAsync();
            expect(combobox.value).toBe(testHostComponent.selectOptions[0]!.name);
            testHostComponent.selectedOption.setValue(testHostComponent.selectOptions[1]); // second duplicate value
            fixture.detectChanges();
            await waitForUpdatesAsync();
            expect(combobox.value).toBe(testHostComponent.selectOptions[1]!.name);
        });

        it('removing first duplicate value from DOM allows selection of now unduplicated value', async () => {
            testHostComponent.selectOptions = testHostComponent.selectOptions.filter((_, i) => i !== 0);
            fixture.detectChanges();
            await waitForUpdatesAsync();
            clickOnListOption(combobox, 0); // select unduplicated option
            fixture.detectChanges();
            processUpdates();

            expect(testHostComponent.selectedOption.value).toBe(testHostComponent.selectOptions[0]);
        });

        it('can select different options with the same model value', () => {
            clickOnListOption(combobox, 6); // select first option with shared model value
            fixture.detectChanges();
            processUpdates();
            expect(testHostComponent.selectedOption.value).toBe(testHostComponent.sharedOption);
            expect(combobox.value).toBe('Shared Option 1');
            clickOnListOption(combobox, 7); // select second option with shared model value
            fixture.detectChanges();
            processUpdates();
            expect(testHostComponent.selectedOption.value).toBe(testHostComponent.sharedOption);
            expect(combobox.value).toBe('Shared Option 2');
        });

        it('can still select one shared option after removing the other', async () => {
            testHostComponent.showFirstSharedOption = false;
            fixture.detectChanges();
            await waitForUpdatesAsync();
            clickOnListOption(combobox, 6); // select now lone option with the assigned model
            fixture.detectChanges();
            processUpdates();

            expect(testHostComponent.selectedOption.value).toBe(testHostComponent.sharedOption);
            expect(combobox.value).toBe('Shared Option 2');
        });

        it('update option value with new model, followed by updating combobox value with same model updates display correctly', async () => {
            const newModelValue: TestModel = { name: 'newName', value: 101 };
            testHostComponent.dynamicOption = newModelValue;
            testHostComponent.selectedOption.setValue(newModelValue);
            fixture.detectChanges();
            await waitForUpdatesAsync();

            expect(combobox.value).toBe('newName');
        });

        it('combobox supports a large amount of options', () => {
            const newOptions: TestModel[] = [];
            for (let i = 0; i < 300; i++) {
                newOptions.push({ name: i.toString(), value: i });
            }
            testHostComponent.selectOptions = newOptions;
            expect(() => {
                fixture.detectChanges();
            }).not.toThrow();
        });
    });
});
