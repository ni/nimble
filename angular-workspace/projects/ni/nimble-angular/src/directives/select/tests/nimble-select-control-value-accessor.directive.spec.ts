import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import type { Select } from '@ni/nimble-components/dist/esm/select';
import { NimbleSelectModule } from '../nimble-select.module';
import { NimbleListboxOptionModule } from '../../listbox-option';
import { waitAnimationFrame, waitMicrotask, waitTask } from '../../../async-test-utilities';

function setSelectValue(select: Select, index: number): void {
    select.dispatchEvent(new Event('click'));
    select.options[index].dispatchEvent(new Event('click', { bubbles: true }));
}

describe('Nimble select control value accessor', () => {
    describe('when using option\'s [ngValue] binding', () => {
        @Component({
            template: `
                <nimble-select #select [(ngModel)]="selectedOption" [compareWith]="compareWith" [disabled]="selectDisabled">
                    <nimble-listbox-option *ngFor="let option of selectOptions"
                        [ngValue]="option">
                        {{ option.name }}
                    </nimble-listbox-option>
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

            public compareWith(option1: { name: string, value: number }, option2: { name: string, value: number }): boolean {
                return option1 && option2 && option1.value === option2.value;
            }
        }

        let select: Select;
        let fixture: ComponentFixture<TestHostComponent>;
        let testHostComponent: TestHostComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSelectModule, NimbleListboxOptionModule, FormsModule]
            });
        });

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestHostComponent);
            testHostComponent = fixture.componentInstance;
            select = testHostComponent.select.nativeElement;
            fixture.detectChanges();
            // wait for select's 'options' property to be updated from slotted content
            await waitTask();
        });

        it('sets correct initial selected value', () => {
            expect(testHostComponent.selectedOption).toBe(testHostComponent.selectOptions[1]);
            expect(select.selectedIndex).toBe(1);
        });

        it('updates selected value when bound property is changed', async () => {
            testHostComponent.selectedOption = testHostComponent.selectOptions[2];
            fixture.detectChanges();
            await waitMicrotask();

            expect(select.selectedIndex).toBe(2);
        });

        it('updates bound property when selected value is changed', () => {
            setSelectValue(select, 2);
            fixture.detectChanges();

            expect(testHostComponent.selectedOption).toBe(testHostComponent.selectOptions[2]);
        });

        it('uses "compareWith" function to determine value equality', async () => {
            // copy object to test equality checking
            const newValue = JSON.parse(JSON.stringify(testHostComponent.selectOptions[2])) as { name: string, value: number };
            testHostComponent.selectedOption = newValue;
            fixture.detectChanges();
            await waitMicrotask();

            expect(select.selectedIndex).toBe(2);
        });

        it('sets "disabled" attribute with value of bound property', async () => {
            testHostComponent.selectDisabled = true;
            fixture.detectChanges();
            await waitAnimationFrame();

            expect(select.getAttribute('disabled')).toBe('');
            expect(select.disabled).toBe(true);
        });
    });

    describe('when using option\'s [value] binding', () => {
        @Component({
            template: `
                <nimble-select #select [(ngModel)]="selectedOption">
                    <nimble-listbox-option *ngFor="let option of selectOptions"
                        [value]="option.value">
                        {{ option.name }}
                    </nimble-listbox-option>
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

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSelectModule, NimbleListboxOptionModule, FormsModule]
            }).compileComponents();
        });

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestHostComponent);
            testHostComponent = fixture.componentInstance;
            select = testHostComponent.select.nativeElement;
            fixture.detectChanges();
            // wait for select's 'options' property to be updated from slotted content
            await waitTask();
        });

        it('sets correct initial selected value', () => {
            expect(testHostComponent.selectedOption).toBe(testHostComponent.selectOptions[1].value.toString());
            expect(select.selectedIndex).toBe(1);
        });

        it('updates selected value when bound property is changed', async () => {
            testHostComponent.selectedOption = testHostComponent.selectOptions[2].value.toString();
            fixture.detectChanges();
            await waitMicrotask();

            expect(select.selectedIndex).toBe(2);
        });

        it('updates bound property when selected value is changed', async () => {
            setSelectValue(select, 2);
            fixture.detectChanges();

            expect(testHostComponent.selectedOption).toBe(testHostComponent.selectOptions[2].value.toString());
        });
    });
});
