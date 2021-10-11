import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Checkbox } from '@ni/nimble-components/dist/esm/checkbox';
import { NimbleCheckboxModule } from '../nimble-checkbox.module';
import { waitAnimationFrame, waitMicrotask } from '../../../async-test-utilities';

function toggleCheckboxValue(checkbox: Checkbox): void {
    checkbox.click();
}

describe('Nimble checkbox control value accessor', () => {
    @Component({
        template: `
            <nimble-checkbox #checkbox [(ngModel)]="value" [disabled]="fieldDisabled"></nimble-checkbox>
         `
    })
    class TestHostComponent {
        @ViewChild('checkbox', { static: true }) public checkbox: ElementRef<Checkbox>;

        public readonly initialValue = true;
        public value = this.initialValue;
        public fieldDisabled = false;
    }

    let checkbox: Checkbox;
    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleCheckboxModule, FormsModule]
        });
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        checkbox = testHostComponent.checkbox.nativeElement;
        fixture.detectChanges();
    });

    it('sets correct initial value', () => {
        expect(testHostComponent.value).toBe(testHostComponent.initialValue);
        expect(checkbox.checked).toBe(testHostComponent.initialValue);
    });

    it('updates value when bound property is changed', async () => {
        const newValue = false;
        testHostComponent.value = newValue;
        fixture.detectChanges();
        await waitMicrotask();

        expect(checkbox.checked).toBe(newValue);
    });

    it('updates bound property when value is changed', async () => {
        toggleCheckboxValue(checkbox);
        fixture.detectChanges();

        expect(testHostComponent.value).toBe(false);
    });

    it('sets "disabled" attribute with value of bound property', async () => {
        testHostComponent.fieldDisabled = true;
        fixture.detectChanges();
        await waitAnimationFrame();

        expect(checkbox.getAttribute('disabled')).toBe('');
        expect(checkbox.disabled).toBe(true);
    });
});
