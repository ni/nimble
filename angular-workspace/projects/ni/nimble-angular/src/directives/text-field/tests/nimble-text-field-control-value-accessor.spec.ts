import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TextField } from '@ni/nimble-components/dist/esm/text-field';
import { NimbleTextFieldModule } from '../nimble-text-field.module';
import { waitAnimationFrame, waitMicrotask } from '../../../async-test-utilities';

function setTextFieldValue(textField: TextField, value: string): void {
    textField.value = value;
    textField.dispatchEvent(new Event('input'));
    textField.dispatchEvent(new Event('change'));
}

describe('Nimble text field control value accessor', () => {
    @Component({
        template: `
            <nimble-text-field #textField [(ngModel)]="value" [disabled]="fieldDisabled"></nimble-text-field>
         `
    })
    class TestHostComponent {
        @ViewChild('textField', { static: true }) public textField: ElementRef<TextField>;

        public readonly initialValue = 'initial value';
        public value = this.initialValue;
        public fieldDisabled = false;
    }

    let textField: TextField;
    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleTextFieldModule, FormsModule]
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        textField = testHostComponent.textField.nativeElement;
        fixture.detectChanges();
    });

    it('sets correct initial value', () => {
        expect(testHostComponent.value).toBe(testHostComponent.initialValue);
        expect(textField.value).toBe(testHostComponent.initialValue);
    });

    it('updates value when bound property is changed', async () => {
        const newValue = 'new value';
        testHostComponent.value = newValue;
        fixture.detectChanges();
        await waitMicrotask();

        expect(textField.value).toBe(newValue);
    });

    it('updates bound property when value is changed', async () => {
        const newValue = 'new value';
        setTextFieldValue(textField, newValue);
        fixture.detectChanges();

        expect(testHostComponent.value).toBe(newValue);
    });

    it('sets "disabled" attribute with value of bound property', async () => {
        testHostComponent.fieldDisabled = true;
        fixture.detectChanges();
        await waitAnimationFrame();

        expect(textField.getAttribute('disabled')).toBe('');
        expect(textField.disabled).toBe(true);
    });
});
