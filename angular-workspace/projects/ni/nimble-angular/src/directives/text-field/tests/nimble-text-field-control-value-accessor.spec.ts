import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { processUpdates } from '../../../testing/async-helpers';
import type { TextField } from '../nimble-text-field.directive';
import { NimbleTextFieldModule } from '../nimble-text-field.module';

function setTextFieldValue(textField: TextField, value: string): void {
    textField.value = value;
    textField.dispatchEvent(new Event('input'));
    textField.dispatchEvent(new Event('change'));
}

describe('Nimble text field control value accessor', () => {
    @Component({
        template: `
            <nimble-text-field #textField [(ngModel)]="value" (ngModelChange)="onModelValueChange($event)" [disabled]="fieldDisabled"></nimble-text-field>
         `
    })
    class TestHostComponent {
        @ViewChild('textField', { static: true }) public textField: ElementRef<TextField>;

        public readonly initialValue = 'initial value';
        public value = this.initialValue;
        public fieldDisabled = false;

        public onModelValueChange(_value: string): void {}
    }

    let textField: TextField;
    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleTextFieldModule, FormsModule]
        });
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        textField = testHostComponent.textField.nativeElement;
        fixture.detectChanges();
        tick();
    }));

    afterEach(() => {
        processUpdates();
    });

    it('sets correct initial value', () => {
        expect(testHostComponent.value).toBe(testHostComponent.initialValue);
        expect(textField.value).toBe(testHostComponent.initialValue);
    });

    it('updates value when bound property is changed', fakeAsync(() => {
        const newValue = 'new value';
        testHostComponent.value = newValue;
        fixture.detectChanges();
        tick();

        expect(textField.value).toBe(newValue);
    }));

    it('updates bound property when value is changed', () => {
        const newValue = 'new value';
        setTextFieldValue(textField, newValue);
        fixture.detectChanges();

        expect(testHostComponent.value).toBe(newValue);
    });

    it('sets "disabled" attribute with value of bound property', fakeAsync(() => {
        testHostComponent.fieldDisabled = true;
        fixture.detectChanges();
        tick();
        processUpdates();

        expect(textField.getAttribute('disabled')).toBe('');
        expect(textField.disabled).toBe(true);
    }));

    it('fires ngModelChange one time with expected value', () => {
        const ngModelChangeSpy = spyOn(testHostComponent, 'onModelValueChange');
        const newValue = 'new value';
        setTextFieldValue(textField, newValue);
        fixture.detectChanges();
        expect(ngModelChangeSpy).toHaveBeenCalledOnceWith(newValue);
    });
});
