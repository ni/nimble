import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { processUpdates } from '../../../testing/async-helpers';
import type { TextArea } from '../nimble-text-area.directive';
import { NimbleTextAreaModule } from '../nimble-text-area.module';

function setTextAreaValue(textArea: TextArea, value: string): void {
    textArea.value = value;
    textArea.dispatchEvent(new Event('input'));
    textArea.dispatchEvent(new Event('change'));
}

describe('Nimble text area control value accessor', () => {
    @Component({
        template: `
            <nimble-text-area #textArea [(ngModel)]="value" (ngModelChange)="onModelValueChange($event)" [disabled]="fieldDisabled"></nimble-text-area>
         `
    })
    class TestHostComponent {
        @ViewChild('textArea', { static: true }) public textArea: ElementRef<TextArea>;

        public readonly initialValue = 'the initial value';
        public value = this.initialValue;
        public fieldDisabled = false;

        public onModelValueChange(_value: string): void {}
    }

    let textArea: TextArea;
    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleTextAreaModule, FormsModule]
        });
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        textArea = testHostComponent.textArea.nativeElement;
        fixture.detectChanges();
        tick();
    }));

    afterEach(() => {
        processUpdates();
    });

    it('sets correct initial value', () => {
        expect(testHostComponent.value).toBe(testHostComponent.initialValue);
        expect(textArea.value).toBe(testHostComponent.initialValue);
    });

    it('updates value when bound property is changed', fakeAsync(() => {
        const newValue = 'new value';
        testHostComponent.value = newValue;
        fixture.detectChanges();
        tick();

        expect(textArea.value).toBe(newValue);
    }));

    it('updates bound property when value is changed', () => {
        const newValue = 'new value';
        setTextAreaValue(textArea, newValue);
        fixture.detectChanges();

        expect(testHostComponent.value).toBe(newValue);
    });

    it('sets "disabled" attribute with value of bound property', fakeAsync(() => {
        testHostComponent.fieldDisabled = true;
        fixture.detectChanges();
        tick();
        processUpdates();

        expect(textArea.getAttribute('disabled')).toBe('');
        expect(textArea.disabled).toBe(true);
    }));

    it('fires ngModelChange one time with expected value', () => {
        const ngModelChangeSpy = spyOn(testHostComponent, 'onModelValueChange');
        const newValue = 'new value';
        setTextAreaValue(textArea, newValue);
        fixture.detectChanges();
        expect(ngModelChangeSpy).toHaveBeenCalledOnceWith(newValue);
    });
});