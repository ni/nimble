import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NimbleSelectModule } from '../nimble-select.module';
import { NimbleListboxOptionModule } from '../../listbox-option';
import { Select } from '../../../../../../../../packages/nimble-components/dist/esm/select';

export async function waitForAsync(conditionFn: () => boolean): Promise<void> {
    while (!conditionFn()) {
        // eslint-disable-next-line no-await-in-loop
        await waitAsync();
    }
}

export async function waitAsync(): Promise<void> {
    await new Promise(resolve => window.requestAnimationFrame(resolve));
}

function setSelectValue(select: Select, index: number): void {
    select.dispatchEvent(new Event('click'));
    select.options[index].dispatchEvent(new Event('click', { bubbles: true }));
}

fdescribe('Nimble select control value accessor', () => {
    @Component({
        template: `
            <nimble-select #select1 [(ngModel)]="selectedOption1" [compareWith]="compareWith">
                <nimble-listbox-option *ngFor="let option of select1Options"
                    [ngValue]="option">
                    {{ option.name }}
                </nimble-listbox-option>
            </nimble-select>
            <nimble-select #select2 [(ngModel)]="selectedOption2">
                <nimble-listbox-option *ngFor="let option of select2Options"
                    [value]="option.value">
                    {{ option.name }}
                </nimble-listbox-option>
            </nimble-select>
         `
    })
    class TestHostComponent {
        @ViewChild('select1', { static: true }) public select1: ElementRef<Select>;
        @ViewChild('select2', { static: true }) public select2: ElementRef<Select>;

        public select1Options: { name: string, value: number }[] = [
            { name: 'Option 1', value: 1 },
            { name: 'Option 2', value: 2 },
            { name: 'Option 3', value: 3 }
        ];

        public select2Options: { name: string, value: number }[] = [
            { name: 'Option 4', value: 4 },
            { name: 'Option 5', value: 5 },
            { name: 'Option 6', value: 6 }
        ];

        public selectedOption1 = this.select1Options[1];
        public selectedOption2 = this.select2Options[1].value.toString();

        public compareWith(option1: { name: string, value: number }, option2: { name: string, value: number }): boolean {
            return option1 && option2 && option1.value === option2.value;
        }
    }

    let select1: Select;
    let select2: Select;
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
        select1 = testHostComponent.select1.nativeElement;
        select2 = testHostComponent.select2.nativeElement;
        fixture.detectChanges();
        await waitForAsync(() => select1.options.length !== 0);
    });

    describe('when using [ngValue] binding', () => {
        it('should set correct initial selected value', async () => {
            expect(testHostComponent.selectedOption1).toBe(testHostComponent.select1Options[1]);
            expect(select1.selectedIndex).toBe(1);
        });

        it('should update selected value when bound property is changed', async () => {
            testHostComponent.selectedOption1 = testHostComponent.select1Options[2];
            fixture.detectChanges();
            await waitAsync();

            expect(select1.selectedIndex).toBe(2);
        });

        it('should update bound property when selected value is changed', async () => {
            setSelectValue(select1, 2);
            fixture.detectChanges();

            expect(testHostComponent.selectedOption1).toBe(testHostComponent.select1Options[2]);
        });

        it('should use "compareWith" function to determine value equality', async () => {
            // copy object to test equality checking
            const newValue = JSON.parse(JSON.stringify(testHostComponent.select1Options[2])) as { name: string, value: number };
            testHostComponent.selectedOption1 = newValue;
            fixture.detectChanges();
            await waitAsync();

            expect(select1.selectedIndex).toBe(2);
        });
    });

    describe('when using [value] binding', () => {
        it('should set correct initial selected value', async () => {
            expect(testHostComponent.selectedOption2).toBe(testHostComponent.select2Options[1].value.toString());
            expect(select2.selectedIndex).toBe(1);
        });

        it('should update selected value when bound property is changed', async () => {
            testHostComponent.selectedOption2 = testHostComponent.select2Options[2].value.toString();
            fixture.detectChanges();
            await waitAsync();

            expect(select2.selectedIndex).toBe(2);
        });

        it('should update bound property when selected value is changed', async () => {
            setSelectValue(select2, 2);
            fixture.detectChanges();

            expect(testHostComponent.selectedOption2).toBe(testHostComponent.select2Options[2].value.toString());
        });
    });
});