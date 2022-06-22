import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { processUpdates } from '../../../testing/async-helpers';
import type { Combobox } from '../nimble-combobox.directive';
import { NimbleComboboxModule } from '../nimble-combobox.module';

function setComboboxValue(combobox: Combobox, value: string): void {
    combobox.value = value;
    combobox.dispatchEvent(new Event('input'));
    combobox.dispatchEvent(new Event('change'));
}

describe('Nimble combobox control value accessor', () => {
    @Component({
        template: `
            <nimble-combobox #combobox [(ngModel)]="value" [disabled]="fieldDisabled"></nimble-combobox>
         `
    })
    class TestHostComponent {
        @ViewChild('combobox', { static: true }) public combobox: ElementRef<Combobox>;

        public readonly initialValue = 'initial value';
        public value = this.initialValue;
        public fieldDisabled = false;
    }

    let combobox: Combobox;
    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleComboboxModule, FormsModule]
        });
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        combobox = testHostComponent.combobox.nativeElement;
        fixture.detectChanges();
        tick();
    }));

    afterEach(() => {
        processUpdates();
    });

    it('sets correct initial value', () => {
        expect(testHostComponent.value).toBe(testHostComponent.initialValue);
        expect(combobox.value).toBe(testHostComponent.initialValue);
    });

    it('updates value when bound property is changed', fakeAsync(() => {
        const newValue = 'new value';
        testHostComponent.value = newValue;
        fixture.detectChanges();
        tick();

        expect(combobox.value).toBe(newValue);
    }));

    it('updates bound property when value is changed', () => {
        const newValue = 'new value';
        setComboboxValue(combobox, newValue);
        fixture.detectChanges();

        expect(testHostComponent.value).toBe(newValue);
    });

    it('sets "disabled" attribute with value of bound property', fakeAsync(() => {
        testHostComponent.fieldDisabled = true;
        fixture.detectChanges();
        tick();
        processUpdates();

        expect(combobox.getAttribute('disabled')).toBe('');
        expect(combobox.disabled).toBe(true);
    }));
});
