import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { processUpdates } from '../../../testing/async-helpers';
import type { ToggleButton } from '../nimble-toggle-button.directive';
import { NimbleToggleButtonModule } from '../nimble-toggle-button.module';

function toggleButtonState(button: ToggleButton): void {
    button.control.click();
}

describe('Nimble toggle button control value accessor', () => {
    @Component({
        template: `
            <nimble-toggle-button #toggleButton [(ngModel)]="value" (ngModelChange)="onModelValueChange($event)" [disabled]="fieldDisabled"></nimble-toggle-button>
         `
    })
    class TestHostComponent {
        @ViewChild('toggleButton', { static: true }) public toggleButton: ElementRef<ToggleButton>;

        public readonly initialValue = true;
        public value = this.initialValue;
        public fieldDisabled = false;

        public onModelValueChange(_value: boolean): void {}
    }

    let toggleButton: ToggleButton;
    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleToggleButtonModule, FormsModule]
        });
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        toggleButton = testHostComponent.toggleButton.nativeElement;
        fixture.detectChanges();
        tick();
    }));

    afterEach(() => {
        processUpdates();
    });

    it('sets correct initial value', () => {
        expect(testHostComponent.value).toBe(testHostComponent.initialValue);
        expect(toggleButton.checked).toBe(testHostComponent.initialValue);
    });

    it('updates value when bound property is changed', fakeAsync(() => {
        const newValue = false;
        testHostComponent.value = newValue;
        fixture.detectChanges();
        tick();

        expect(toggleButton.checked).toBe(newValue);
    }));

    it('updates bound property when value is changed', () => {
        toggleButtonState(toggleButton);
        fixture.detectChanges();

        expect(testHostComponent.value).toBe(false);
    });

    it('sets "disabled" attribute with value of bound property', fakeAsync(() => {
        testHostComponent.fieldDisabled = true;
        fixture.detectChanges();
        tick();
        processUpdates();

        expect(toggleButton.getAttribute('disabled')).toBe('');
        expect(toggleButton.disabled).toBe(true);
    }));

    it('fires ngModelChange one time with expected value', () => {
        const ngModelChangeSpy = spyOn(testHostComponent, 'onModelValueChange');
        toggleButtonState(toggleButton);
        fixture.detectChanges();
        expect(ngModelChangeSpy).toHaveBeenCalledOnceWith(false);
    });
});
