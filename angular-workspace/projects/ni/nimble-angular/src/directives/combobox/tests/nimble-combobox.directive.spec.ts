import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComboboxAutocomplete } from '../../../public-api';
import type { BooleanValueOrAttribute } from '../../utilities/template-value-helpers';
import { Combobox, NimbleComboboxDirective } from '../nimble-combobox.directive';
import { NimbleComboboxModule } from '../nimble-combobox.module';

describe('Nimble combobox', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleComboboxModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-combobox')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-combobox #combobox></nimble-combobox>
            `
        })
        class TestHostComponent {
            @ViewChild('combobox', { read: NimbleComboboxDirective }) public directive: NimbleComboboxDirective;
            @ViewChild('combobox', { read: ElementRef }) public elementRef: ElementRef<Combobox>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleComboboxDirective;
        let nativeElement: Combobox;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleComboboxModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();
        });

        it('has expected defaults for autocomplete', () => {
            expect(directive.autocomplete).toBeUndefined();
            expect(nativeElement.autocomplete).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-combobox #combobox
                    disabled
                    autocomplete="inline">
                </nimble-combobox>`
        })
        class TestHostComponent {
            @ViewChild('combobox', { read: NimbleComboboxDirective }) public directive: NimbleComboboxDirective;
            @ViewChild('combobox', { read: ElementRef }) public elementRef: ElementRef<Combobox>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleComboboxDirective;
        let nativeElement: Combobox;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleComboboxModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for disabled', () => {
            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('will use template string values for autocomplete', () => {
            expect(directive.autocomplete).toEqual(ComboboxAutocomplete.inline);
            expect(nativeElement.autocomplete).toEqual(ComboboxAutocomplete.inline);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-combobox #combobox
                    [disabled]="disabled"
                    [autocomplete]="autocomplete">
                </nimble-combobox>
            `
        })
        class TestHostComponent {
            @ViewChild('combobox', { read: NimbleComboboxDirective }) public directive: NimbleComboboxDirective;
            @ViewChild('combobox', { read: ElementRef }) public elementRef: ElementRef<Combobox>;
            public disabled = false;
            public autocomplete: ComboboxAutocomplete = ComboboxAutocomplete.list;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleComboboxDirective;
        let nativeElement: Combobox;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleComboboxModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = true;
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with property binding for autocomplete', () => {
            expect(directive.autocomplete).toEqual(ComboboxAutocomplete.list);
            expect(nativeElement.autocomplete).toEqual(ComboboxAutocomplete.list);

            fixture.componentInstance.autocomplete = ComboboxAutocomplete.both;
            fixture.detectChanges();

            expect(directive.autocomplete).toEqual(ComboboxAutocomplete.both);
            expect(nativeElement.autocomplete).toEqual(ComboboxAutocomplete.both);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-combobox #combobox
                    [attr.disabled]="disabled"
                    [attr.autocomplete]="autocomplete">
                </nimble-combobox>
            `
        })
        class TestHostComponent {
            @ViewChild('combobox', { read: NimbleComboboxDirective }) public directive: NimbleComboboxDirective;
            @ViewChild('combobox', { read: ElementRef }) public elementRef: ElementRef<Combobox>;
            public disabled: BooleanValueOrAttribute = null;
            public autocomplete: ComboboxAutocomplete | undefined = undefined;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleComboboxDirective;
        let nativeElement: Combobox;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleComboboxModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = '';
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with attribute binding for autocomplete', () => {
            expect(directive.autocomplete).toBeUndefined();
            expect(nativeElement.autocomplete).toBeUndefined();

            fixture.componentInstance.autocomplete = ComboboxAutocomplete.both;
            fixture.detectChanges();

            expect(directive.autocomplete).toEqual(ComboboxAutocomplete.both);
            expect(nativeElement.autocomplete).toEqual(ComboboxAutocomplete.both);
        });
    });
});
