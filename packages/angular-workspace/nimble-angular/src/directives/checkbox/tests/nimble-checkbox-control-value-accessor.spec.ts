import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { processUpdates } from '../../../testing/async-helpers';
import type { Checkbox } from '../nimble-checkbox.directive';
import { NimbleCheckboxModule } from '../nimble-checkbox.module';

function toggleCheckboxValue(checkbox: Checkbox): void {
    checkbox.click();
}

describe('Nimble checkbox control value accessor', () => {
    @Component({
        template: `
            <nimble-checkbox #checkbox [(ngModel)]="value" (ngModelChange)="onModelValueChange($event)" [disabled]="fieldDisabled"></nimble-checkbox>
         `
    })
    class TestHostComponent {
        @ViewChild('checkbox', { static: true }) public checkbox: ElementRef<Checkbox>;

        public readonly initialValue = true;
        public value = this.initialValue;
        public fieldDisabled = false;

        public onModelValueChange(_value: boolean): void {}
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

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        checkbox = testHostComponent.checkbox.nativeElement;
        fixture.detectChanges();
        tick();
    }));

    afterEach(() => {
        processUpdates();
    });

    it('sets correct initial value', () => {
        expect(testHostComponent.value).toBe(testHostComponent.initialValue);
        expect(checkbox.checked).toBe(testHostComponent.initialValue);
    });

    it('updates value when bound property is changed', fakeAsync(() => {
        const newValue = false;
        testHostComponent.value = newValue;
        fixture.detectChanges();
        tick();

        expect(checkbox.checked).toBe(newValue);
    }));

    it('updates bound property when value is changed', () => {
        toggleCheckboxValue(checkbox);
        fixture.detectChanges();

        expect(testHostComponent.value).toBe(false);
    });

    it('sets "disabled" attribute with value of bound property', fakeAsync(() => {
        testHostComponent.fieldDisabled = true;
        fixture.detectChanges();
        tick();
        processUpdates();

        expect(checkbox.getAttribute('disabled')).toBe('');
        expect(checkbox.disabled).toBe(true);
    }));

    it('fires ngModelChange one time with expected value', () => {
        const ngModelChangeSpy = spyOn(testHostComponent, 'onModelValueChange');
        toggleCheckboxValue(checkbox);
        fixture.detectChanges();

        expect(ngModelChangeSpy).toHaveBeenCalledOnceWith(false);
    });
});
