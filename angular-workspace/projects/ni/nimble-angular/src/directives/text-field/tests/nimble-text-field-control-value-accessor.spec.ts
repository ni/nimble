import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NimbleTextFieldModule } from '../nimble-text-field.module';
import { TextField } from '../../../../../../../../packages/nimble-components/dist/esm/text-field';

async function waitAsync(): Promise<void> {
    await new Promise(window.requestAnimationFrame);
}

function setTextFieldValue(textField: TextField, value: string): void {
    textField.value = value;
    textField.dispatchEvent(new Event('input'));
}

describe('Nimble text field control value accessor', () => {
    @Component({
        template: `
            <nimble-text-field #textField [(ngModel)]="value"></nimble-text-field>
         `
    })
    class TestHostComponent {
        @ViewChild('textField', { static: true }) public textField: ElementRef<TextField>;

        public readonly initialValue = 'initial value';
        public value = this.initialValue;
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

    it('should set correct initial selected value', async () => {
        expect(testHostComponent.value).toBe(testHostComponent.initialValue);
        expect(textField.value).toBe(testHostComponent.initialValue);
    });

    it('should update selected value when bound property is changed', async () => {
        const newValue = 'new value';
        testHostComponent.value = newValue;
        fixture.detectChanges();
        await waitAsync();

        expect(textField.value).toBe(newValue);
    });

    fit('should update bound property when selected value is changed', async () => {
        const newValue = 'new value';
        setTextFieldValue(textField, newValue);
        fixture.detectChanges();

        expect(testHostComponent.value).toBe(newValue);
    });
});
