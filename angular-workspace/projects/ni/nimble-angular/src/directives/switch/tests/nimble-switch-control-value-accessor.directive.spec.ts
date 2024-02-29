import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { processUpdates } from '../../../testing/async-helpers';
import type { Switch } from '../nimble-switch.directive';
import { NimbleSwitchModule } from '../nimble-switch.module';

function toggleSwitchState(switchElement: Switch): void {
    switchElement.click();
}

describe('Nimble switch control value accessor', () => {
    @Component({
        template: `
            <nimble-switch #switch [(ngModel)]="value" (ngModelChange)="onModelValueChange($event)" [disabled]="fieldDisabled"></nimble-switch>
         `
    })
    class TestHostComponent {
        @ViewChild('switch', { static: true }) public switch: ElementRef<Switch>;

        public readonly initialValue = true;
        public value = this.initialValue;
        public fieldDisabled = false;

        public onModelValueChange(_value: boolean): void {}
    }

    let switchElement: Switch;
    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleSwitchModule, FormsModule]
        });
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        switchElement = testHostComponent.switch.nativeElement;
        fixture.detectChanges();
        tick();
    }));

    afterEach(() => {
        processUpdates();
    });

    it('sets correct initial value', () => {
        expect(testHostComponent.value).toBe(testHostComponent.initialValue);
        expect(switchElement.checked).toBe(testHostComponent.initialValue);
    });

    it('updates value when bound property is changed', fakeAsync(() => {
        const newValue = false;
        testHostComponent.value = newValue;
        fixture.detectChanges();
        tick();

        expect(switchElement.checked).toBe(newValue);
    }));

    it('updates bound property when value is changed', () => {
        toggleSwitchState(switchElement);
        fixture.detectChanges();

        expect(testHostComponent.value).toBe(false);
    });

    it('sets "disabled" attribute with value of bound property', fakeAsync(() => {
        testHostComponent.fieldDisabled = true;
        fixture.detectChanges();
        tick();
        processUpdates();

        expect(switchElement.getAttribute('disabled')).toBe('');
        expect(switchElement.disabled).toBe(true);
    }));

    it('fires ngModelChange one time with expected value', () => {
        const ngModelChangeSpy = spyOn(testHostComponent, 'onModelValueChange');
        toggleSwitchState(switchElement);
        fixture.detectChanges();
        expect(ngModelChangeSpy).toHaveBeenCalledOnceWith(false);
    });
});
