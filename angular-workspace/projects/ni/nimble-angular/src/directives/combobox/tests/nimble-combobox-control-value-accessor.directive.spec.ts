import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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

function updateComboboxWithText(combobox: Combobox, text: string): void {
    combobox.control.value = text;
    const inputEvent = new InputEvent('input', { data: text, inputType: 'insertText' });
    combobox.inputHandler(inputEvent);
    combobox.dispatchEvent(inputEvent);
}

interface TestModel {
    name: string;
    value: number;
}

describe('Nimble combobox control value accessor', () => {
    describe('when using option\'s [ngValue] binding on template-based form', () => {
        @Component({
            template: `
                <nimble-combobox #combobox [(ngModel)]="selectedOption" (ngModelChange)="onModelValueChange($event)" [compareWith]="compareWith" [disabled]="selectDisabled" autocomplete="both">
                    <nimble-list-option *ngFor="let option of selectOptions" [ngValue]="option">{{ option?.name ?? nullValueString }}</nimble-list-option>
                    <nimble-list-option [ngValue]="dynamicOption">{{ dynamicOption?.name }}</nimble-list-option>
                </nimble-combobox>
             `
        })
        class TestHostComponent {
            @ViewChild('combobox', { static: true }) public combobox: ElementRef<Combobox>;

            public selectOptions: (TestModel | null)[] = [
                { name: 'Option 1', value: 1 },
                { name: 'Option 2', value: 2 },
                { name: 'Option 3', value: 3 },
                null
            ];

            public defaultSelection = this.selectOptions[1];
            public selectedOption: TestModel | null | OptionNotFound = this.defaultSelection;
            public dynamicOption: TestModel = { name: 'Dynamic Option 1', value: 4 };
            public readonly nullValueString = 'null';

            public selectDisabled = false;

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
            expect(testHostComponent.selectedOption).toBe(testHostComponent.defaultSelection);
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
            const newValue = JSON.parse(JSON.stringify(testHostComponent.selectOptions[2])) as TestModel;
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
            const modelValueNotInList: TestModel = { name: 'foo', value: 5 };
            testHostComponent.selectedOption = modelValueNotInList;
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(combobox.control.value).toEqual('');
            expect(testHostComponent.selectedOption).toBe(modelValueNotInList);
        }));

        it('list-option with current combobox value is removed, combobox display value is unchanged', fakeAsync(() => {
            const currentValue = testHostComponent.defaultSelection;
            testHostComponent.selectOptions.splice(1, 1);
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(combobox.control.value).toEqual('Option 2');
            expect(testHostComponent.selectedOption).toBe(currentValue);
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
            expect(testHostComponent.selectedOption).toBe(testHostComponent.dynamicOption);
        }));

        it('null option is selected, combobox display value is set to provided display string for null', fakeAsync(() => {
            setComboboxValue(combobox, 3); // select null option
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(combobox.control.value).toEqual(testHostComponent.nullValueString);
            expect(testHostComponent.selectedOption).toBe(null);
        }));

        it('set bound value to null, combobox selectedIndex set to option with null value', fakeAsync(() => {
            testHostComponent.selectedOption = null;
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(combobox.selectedIndex).toEqual(3);
            expect(combobox.control.value).toEqual(testHostComponent.nullValueString);
            expect(testHostComponent.selectedOption).toBe(null);
        }));

        it('model changes for option, text display of old option entered, callback value is notFound', fakeAsync(() => {
            testHostComponent.dynamicOption = { name: 'foo', value: 10 };
            fixture.detectChanges();
            tick();
            processUpdates();
            updateComboboxWithText(combobox, 'Dynamic Option 1');
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

            updateComboboxWithText(combobox, 'Option 1');
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(testHostComponent.selectedOption).toEqual(OPTION_NOT_FOUND);
        }));

        it('and user enters aribtrary text for value, callback value is notFound', () => {
            updateComboboxWithText(combobox, 'f');
            fixture.detectChanges();

            expect(testHostComponent.callbackValue).toEqual(OPTION_NOT_FOUND);
        });
    });

    describe('when using option\'s [ngValue] binding on Reactive form', () => {
        @Component({
            template: `
                <form [formGroup]="form">
                    <nimble-combobox #combobox [formControl]="selectedOption" [compareWith]="compareWith" autocomplete="both">
                        <nimble-list-option *ngFor="let option of selectOptions" [ngValue]="option">{{ option?.name ?? nullValueString }}</nimble-list-option>
                        <nimble-list-option [ngValue]="dynamicOption">{{ dynamicOption?.name }}</nimble-list-option>
                    </nimble-combobox>
                </form>
             `
        })
        class TestHostComponent {
            @ViewChild('combobox', { static: true }) public combobox: ElementRef<Combobox>;

            public selectOptions: (TestModel | null)[] = [
                { name: 'Option 1', value: 1 },
                { name: 'Option 2', value: 2 },
                { name: 'Option 3', value: 3 },
                null
            ];

            public defaultOption = this.selectOptions[1];
            public selectedOption = new FormControl<TestModel | null | typeof OPTION_NOT_FOUND>(this.defaultOption);
            public form: FormGroup = new FormGroup({
                selectOption: this.selectedOption
            });

            public dynamicOption: TestModel = { name: 'Dynamic Option 1', value: 4 };
            public readonly nullValueString = 'null';

            public useDefaultOptions = true;

            public compareWith(option1: TestModel | null, option2: TestModel | null): boolean {
                return (!!option1 && !!option2 && option1.value === option2.value) || (option1 === null && option2 === null);
            }
        }

        let combobox: Combobox;
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
            fixture.detectChanges();
            // wait for combobox's 'options' property to be updated from slotted content
            await waitTask();
        });

        afterEach(() => {
            processUpdates();
        });

        it('sets correct initial selected value', () => {
            expect(testHostComponent.selectedOption.value).toBe(testHostComponent.defaultOption);
            expect(combobox.selectedIndex).toBe(1);
        });

        it('updates selected value when bound property is changed', fakeAsync(() => {
            testHostComponent.selectedOption.setValue(testHostComponent.selectOptions[2]);
            fixture.detectChanges();
            tick();

            expect(combobox.selectedIndex).toBe(2);
        }));

        it('updates bound property when selected value is changed', () => {
            setComboboxValue(combobox, 2);
            fixture.detectChanges();

            expect(testHostComponent.selectedOption.value).toBe(testHostComponent.selectOptions[2]);
        });

        it('uses "compareWith" function to determine value equality', fakeAsync(() => {
            const initialIndex = combobox.selectedIndex;
            // copy object to test equality checking
            const newValue = JSON.parse(JSON.stringify(testHostComponent.selectOptions[2])) as TestModel;
            testHostComponent.selectedOption.setValue(newValue);
            fixture.detectChanges();
            tick();

            expect(initialIndex).toEqual(1);
            expect(combobox.selectedIndex).toEqual(2);
        }));

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

        it('sets text to empty string for model value not in list options but maintains set model value', fakeAsync(() => {
            expect(testHostComponent.selectedOption.value).toBe(testHostComponent.defaultOption);
            const valueNotInOptions = { name: 'foo', value: 5 };
            testHostComponent.selectedOption.setValue(valueNotInOptions);
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(combobox.control.value).toEqual('');
            expect(testHostComponent.selectedOption.value).toBe(valueNotInOptions);
        }));

        it('list-option with current combobox value is removed, combobox display value and model value is unchanged', fakeAsync(() => {
            const currentModelValue = testHostComponent.selectedOption.value;
            testHostComponent.selectOptions.splice(1, 1); // removes currently selected option from set
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(combobox.control.value).toEqual('Option 2');
            expect(testHostComponent.selectedOption.value).toBe(currentModelValue);
        }));

        it('model changes for option, then option selected, combobox display value uses text from new model value', fakeAsync(() => {
            testHostComponent.dynamicOption = { name: 'foo', value: 10 };
            fixture.detectChanges();
            tick();
            processUpdates();
            testHostComponent.selectedOption.setValue(testHostComponent.dynamicOption);
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(combobox.control.value).toEqual('foo');
            expect(testHostComponent.selectedOption.value).toBe(testHostComponent.dynamicOption);
        }));

        it('null option is selected, combobox display value is set to provided display string for null', fakeAsync(() => {
            setComboboxValue(combobox, 3); // select null option
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(combobox.control.value).toEqual(testHostComponent.nullValueString);
            expect(testHostComponent.selectedOption.value).toBe(null);
        }));

        it('set bound value to null, combobox selectedIndex set to option with null value', fakeAsync(() => {
            testHostComponent.selectedOption.setValue(null);
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(combobox.selectedIndex).toEqual(3);
            expect(combobox.control.value).toEqual(testHostComponent.nullValueString);
            expect(testHostComponent.selectedOption.value).toBe(null);
        }));

        it('model changes for option, text display of old option entered, selectedOption value is OPTION_NOT_FOUND ', fakeAsync(() => {
            testHostComponent.dynamicOption = { name: 'foo', value: 10 };
            fixture.detectChanges();
            tick();
            processUpdates();
            updateComboboxWithText(combobox, 'Dynamic Option 1');
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(testHostComponent.selectedOption.value).toEqual(OPTION_NOT_FOUND);
        }));

        it('list-option is removed followed by text of removed option entered as value, selectedOption value is OPTION_NOT_FOUND', fakeAsync(() => {
            testHostComponent.selectOptions.splice(0, 1); // remove 'Option 1'
            fixture.detectChanges();
            tick();
            processUpdates();

            updateComboboxWithText(combobox, 'Option 1');
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(testHostComponent.selectedOption.value).toEqual(OPTION_NOT_FOUND);
        }));

        it('as user types, selectedOption value is updated', () => {
            updateComboboxWithText(combobox, 'f');
            fixture.detectChanges();

            expect(testHostComponent.selectedOption.value).toEqual(OPTION_NOT_FOUND);

            updateComboboxWithText(combobox, 'O'); // value should autocomplete to 'Option 1'
            fixture.detectChanges();

            expect(testHostComponent.selectedOption.value).toEqual(testHostComponent.selectOptions[0]);
        });
    });
});
