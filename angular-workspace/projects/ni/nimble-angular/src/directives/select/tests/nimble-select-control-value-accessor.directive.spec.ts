import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NimbleSelectModule } from '../nimble-select.module';
import { NimbleListOptionModule } from '../../list-option/nimble-list-option.module';
import { processUpdates, waitForUpdatesAsync } from '../../../testing/async-helpers';
import type { Select } from '../nimble-select.directive';

function setSelectValue(select: Select, index: number): void {
    select.dispatchEvent(new Event('click'));
    select.options[index].dispatchEvent(new Event('click', { bubbles: true }));
}

describe('Nimble select control value accessor', () => {
    describe('when using option\'s [ngValue] binding', () => {
        @Component({
            template: `
                <nimble-select #select [(ngModel)]="selectedOption" (ngModelChange)="onModelValueChange($event)" [compareWith]="compareWith" [disabled]="selectDisabled">
                    <nimble-list-option *ngFor="let option of selectOptions"
                        [ngValue]="option">
                        {{ option.name }}
                    </nimble-list-option>
                </nimble-select>
             `
        })
        class TestHostComponent {
            @ViewChild('select', { static: true }) public select: ElementRef<Select>;

            public selectOptions: { name: string, value: number }[] = [
                { name: 'Option 1', value: 1 },
                { name: 'Option 2', value: 2 },
                { name: 'Option 3', value: 3 }
            ];

            public selectedOption = this.selectOptions[1];

            public selectDisabled = false;

            public onModelValueChange(_value: { name: string, value: number }): void {}

            public compareWith(option1: { name: string, value: number } | null, option2: { name: string, value: number } | null): boolean {
                return !!option1 && !!option2 && option1.value === option2.value;
            }
        }

        let select: Select;
        let fixture: ComponentFixture<TestHostComponent>;
        let testHostComponent: TestHostComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSelectModule, NimbleListOptionModule, FormsModule]
            });
        });

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestHostComponent);
            testHostComponent = fixture.componentInstance;
            select = testHostComponent.select.nativeElement;
            fixture.detectChanges();
            // wait for select's 'options' property to be updated from slotted content
            await waitForUpdatesAsync();
        });

        afterEach(() => {
            processUpdates();
        });

        it('sets correct initial selected value', () => {
            expect(testHostComponent.selectedOption).toBe(testHostComponent.selectOptions[1]);
            expect(select.selectedIndex).toBe(1);
        });

        it('updates selected value when bound property is changed', fakeAsync(() => {
            testHostComponent.selectedOption = testHostComponent.selectOptions[2];
            fixture.detectChanges();
            tick();

            expect(select.selectedIndex).toBe(2);
        }));

        it('updates bound property when selected value is changed', () => {
            setSelectValue(select, 2);
            fixture.detectChanges();

            expect(testHostComponent.selectedOption).toBe(testHostComponent.selectOptions[2]);
        });

        it('uses "compareWith" function to determine value equality', fakeAsync(() => {
            // copy object to test equality checking
            const newValue = JSON.parse(JSON.stringify(testHostComponent.selectOptions[2])) as { name: string, value: number };
            testHostComponent.selectedOption = newValue;
            fixture.detectChanges();
            tick();

            expect(select.selectedIndex).toBe(2);
        }));

        it('sets "disabled" attribute with value of bound property', fakeAsync(() => {
            testHostComponent.selectDisabled = true;
            fixture.detectChanges();
            tick();
            processUpdates();

            expect(select.getAttribute('disabled')).toBe('');
            expect(select.disabled).toBe(true);
        }));

        it('fires ngModelChange one time with expected value', () => {
            const ngModelChangeSpy = spyOn(testHostComponent, 'onModelValueChange');
            const indexToSelect = 2;
            setSelectValue(select, indexToSelect);
            fixture.detectChanges();
            expect(ngModelChangeSpy).toHaveBeenCalledOnceWith(testHostComponent.selectOptions[indexToSelect]);
        });
    });

    describe('when using option\'s [value] binding', () => {
        @Component({
            template: `
                <nimble-select #select [(ngModel)]="selectedOption">
                    <nimble-list-option *ngFor="let option of selectOptions"
                        [value]="option.value">
                        {{ option.name }}
                    </nimble-list-option>
                </nimble-select>
             `
        })
        class TestHostComponent {
            @ViewChild('select', { static: true }) public select: ElementRef<Select>;

            public selectOptions: { name: string, value: number }[] = [
                { name: 'Option 1', value: 1 },
                { name: 'Option 2', value: 2 },
                { name: 'Option 3', value: 3 }
            ];

            public selectedOption = this.selectOptions[1].value.toString();
        }

        let select: Select;
        let fixture: ComponentFixture<TestHostComponent>;
        let testHostComponent: TestHostComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSelectModule, NimbleListOptionModule, FormsModule]
            });
        });

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestHostComponent);
            testHostComponent = fixture.componentInstance;
            select = testHostComponent.select.nativeElement;
            fixture.detectChanges();
            // wait for select's 'options' property to be updated from slotted content
            await waitForUpdatesAsync();
        });

        afterEach(() => {
            processUpdates();
        });

        it('sets correct initial selected value', () => {
            expect(testHostComponent.selectedOption).toBe(testHostComponent.selectOptions[1].value.toString());
            expect(select.selectedIndex).toBe(1);
        });

        it('updates selected value when bound property is changed', fakeAsync(() => {
            testHostComponent.selectedOption = testHostComponent.selectOptions[2].value.toString();
            fixture.detectChanges();
            tick();

            expect(select.selectedIndex).toBe(2);
        }));

        it('updates bound property when selected value is changed', () => {
            setSelectValue(select, 2);
            fixture.detectChanges();

            expect(testHostComponent.selectedOption).toBe(testHostComponent.selectOptions[2].value.toString());
        });
    });

    describe('dynamically added options on init', () => {
        @Component({
            template: `
                <form [formGroup]='form'>
                    <nimble-select #select formControlName="selectValue">
                        <nimble-list-option *ngFor="let option of selectOptions"
                            [ngValue]="option">
                            {{ option.name }}
                        </nimble-list-option>
                    </nimble-select>
                </form>
             `
        })
        class TestHostComponent implements OnInit {
            @ViewChild('select', { static: true }) public select: ElementRef<Select>;

            @Input() public selectValue = '';

            public selectOptions: { name: string, value: number }[] = [
                { name: 'Option 1', value: 1 },
                { name: 'Option 2', value: 2 },
                { name: 'Option 3', value: 3 }
            ];

            public selectedOption = new FormControl<{ name: string, value: number } | null>(null);

            public form: FormGroup = new FormGroup({
                selectValue: this.selectedOption
            });

            public get selectValueField(): AbstractControl {
                return this.form.get('selectValue')!;
            }

            public ngOnInit(): void {
                this.selectOptions.push({ name: 'Option 4', value: 4 });
                this.selectValueField.setValue(this.selectOptions[3]);
            }
        }

        let select: Select;
        let fixture: ComponentFixture<TestHostComponent>;
        let testHostComponent: TestHostComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSelectModule, NimbleListOptionModule, FormsModule, ReactiveFormsModule]
            });
        });

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestHostComponent);
            testHostComponent = fixture.componentInstance;
            select = testHostComponent.select.nativeElement;
            fixture.detectChanges();
            // wait for select's 'options' property to be updated from slotted content
            await waitForUpdatesAsync();
        });

        afterEach(() => {
            processUpdates();
        });

        it('can set value to option that is dynamically added during init', () => {
            expect(select.selectedIndex).toBe(3);
        });
    });

    describe('dynamically added options on update', () => {
        @Component({
            template: `
                <form [formGroup]='form'>
                    <nimble-select #select formControlName="selectValue">
                        <nimble-list-option *ngFor="let option of selectOptions"
                            [ngValue]="option">
                            {{ option.name }}
                        </nimble-list-option>
                    </nimble-select>
                </form>
             `
        })
        class TestHostComponent implements OnChanges {
            @ViewChild('select', { static: true }) public select: ElementRef<Select>;

            @Input() public selectValue?: { name: string, value: number };

            public selectOptions: { name: string, value: number }[] = [
                { name: 'Option 1', value: 1 },
                { name: 'Option 2', value: 2 },
                { name: 'Option 3', value: 3 }
            ];

            public selectedOption = new FormControl<{ name: string, value: number } | null>(null);

            public form: FormGroup = new FormGroup({
                selectValue: this.selectedOption
            });

            public get selectValueField(): AbstractControl {
                return this.form.get('selectValue')!;
            }

            public ngOnChanges(changes: SimpleChanges): void {
                if (changes.selectValue.currentValue !== changes.selectValue.previousValue) {
                    // intentionally adding option after first option for DOM order
                    const newValue = changes.selectValue.currentValue as { name: string, value: number };
                    this.selectOptions.splice(1, 0, newValue);
                    this.selectValueField.setValue(newValue);
                }
            }
        }

        let select: Select;
        let fixture: ComponentFixture<TestHostComponent>;
        let testHostComponent: TestHostComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSelectModule, NimbleListOptionModule, FormsModule, ReactiveFormsModule]
            });
        });

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestHostComponent);
            testHostComponent = fixture.componentInstance;
            select = testHostComponent.select.nativeElement;
            fixture.detectChanges();
            // wait for select's 'options' property to be updated from slotted content
            await waitForUpdatesAsync();
        });

        afterEach(() => {
            processUpdates();
        });

        it('can set value to option that is dynamically added from input', async () => {
            const oldSelectValue = testHostComponent.selectValue;
            const newValue = { name: 'Option 4', value: 4 };
            testHostComponent.selectValue = newValue;
            // this will result in an option added after the first option in DOM order
            testHostComponent.ngOnChanges({ selectValue: new SimpleChange(oldSelectValue, testHostComponent.selectValue, false) });
            fixture.detectChanges();
            await fixture.whenStable();
            await waitForUpdatesAsync();
            expect(select.selectedIndex).toBe(1);
        });
    });
});
