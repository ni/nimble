import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComboboxAutocomplete, DropdownAppearance } from '../../../public-api';
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

        it('has expected defaults for appearance', () => {
            expect(directive.appearance).toBe(DropdownAppearance.underline);
            expect(nativeElement.appearance).toBe(DropdownAppearance.underline);
        });

        it('has expected defaults for errorText', () => {
            expect(directive.errorText).toBeUndefined();
            expect(nativeElement.errorText).toBeUndefined();
        });

        it('can use the directive to set errorText', () => {
            directive.errorText = 'new value';
            expect(nativeElement.errorText).toBe('new value');
        });

        it('has expected defaults for errorVisible', () => {
            expect(directive.errorVisible).toBeFalse();
            expect(nativeElement.errorVisible).toBeFalse();
        });

        it('can use the directive to set errorVisible', () => {
            directive.errorVisible = true;
            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-combobox #combobox
                    disabled
                    autocomplete="inline"
                    appearance="outline"
                    placeholder="Enter value:"
                    error-text="error text"
                    error-visible
                >
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

        it('will use template string values for appearance', () => {
            expect(directive.appearance).toEqual(DropdownAppearance.outline);
            expect(nativeElement.appearance).toEqual(DropdownAppearance.outline);
        });

        it('will use template string values for placeholder', () => {
            expect(directive.placeholder).toBe('Enter value:');
            expect(nativeElement.placeholder).toBe('Enter value:');
        });

        it('will use template string values for errorText', () => {
            expect(directive.errorText).toBe('error text');
            expect(nativeElement.errorText).toBe('error text');
        });

        it('will use template string values for errorVisible', () => {
            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-combobox #combobox
                    [disabled]="disabled"
                    [autocomplete]="autocomplete"
                    [appearance]="appearance"
                    [placeholder]="placeholder"
                    [error-text]="errorText"
                    [error-visible]="errorVisible"
                >
                </nimble-combobox>
            `
        })
        class TestHostComponent {
            @ViewChild('combobox', { read: NimbleComboboxDirective }) public directive: NimbleComboboxDirective;
            @ViewChild('combobox', { read: ElementRef }) public elementRef: ElementRef<Combobox>;
            public disabled = false;
            public autocomplete: ComboboxAutocomplete = ComboboxAutocomplete.list;
            public appearance: DropdownAppearance = DropdownAppearance.outline;
            public errorText = 'initial value';
            public placeholder = 'Enter value:';
            public errorVisible = false;
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

        it('can be configured with property binding for appearance', () => {
            expect(directive.appearance).toEqual(DropdownAppearance.outline);
            expect(nativeElement.appearance).toEqual(DropdownAppearance.outline);

            fixture.componentInstance.appearance = DropdownAppearance.underline;
            fixture.detectChanges();

            expect(directive.appearance).toEqual(DropdownAppearance.underline);
            expect(nativeElement.appearance).toEqual(DropdownAppearance.underline);
        });

        it('can be configured with property binding for placeholder', () => {
            expect(directive.placeholder).toEqual('Enter value:');
            expect(nativeElement.placeholder).toEqual('Enter value:');

            const newPlaceholderValue = 'Enter new value:';
            fixture.componentInstance.placeholder = newPlaceholderValue;
            fixture.detectChanges();

            expect(directive.placeholder).toEqual(newPlaceholderValue);
            expect(nativeElement.placeholder).toEqual(newPlaceholderValue);
        });

        it('can be configured with property binding for errorText', () => {
            expect(directive.errorText).toBe('initial value');
            expect(nativeElement.errorText).toBe('initial value');

            fixture.componentInstance.errorText = 'new value';
            fixture.detectChanges();

            expect(directive.errorText).toBe('new value');
            expect(nativeElement.errorText).toBe('new value');
        });

        it('can be configured with property binding for errorVisible', () => {
            expect(directive.errorVisible).toBeFalse();
            expect(nativeElement.errorVisible).toBeFalse();

            fixture.componentInstance.errorVisible = true;
            fixture.detectChanges();

            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-combobox #combobox
                    [attr.disabled]="disabled"
                    [attr.autocomplete]="autocomplete"
                    [attr.appearance]="appearance"
                    [attr.placeholder]="placeholder"
                    [attr.error-text]="errorText"
                    [attr.error-visible]="errorVisible"
                >
                </nimble-combobox>
            `
        })
        class TestHostComponent {
            @ViewChild('combobox', { read: NimbleComboboxDirective }) public directive: NimbleComboboxDirective;
            @ViewChild('combobox', { read: ElementRef }) public elementRef: ElementRef<Combobox>;
            public disabled: BooleanValueOrAttribute = null;
            public autocomplete: ComboboxAutocomplete | undefined = undefined;
            public appearance: DropdownAppearance = DropdownAppearance.underline;
            public placeholder = 'Enter value:';
            public errorText = 'initial value';
            public errorVisible: BooleanValueOrAttribute = null;
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

        it('can be configured with attribute binding for appearance', () => {
            expect(directive.appearance).toBe(DropdownAppearance.underline);
            expect(nativeElement.appearance).toBe(DropdownAppearance.underline);

            fixture.componentInstance.appearance = DropdownAppearance.outline;
            fixture.detectChanges();

            expect(directive.appearance).toEqual(DropdownAppearance.outline);
            expect(nativeElement.appearance).toEqual(DropdownAppearance.outline);
        });

        it('can be configured with attribute binding for placeholder', () => {
            expect(directive.placeholder).toBe('Enter value:');
            expect(nativeElement.placeholder).toBe('Enter value:');

            const newPlaceholderValue = 'Enter new value:';
            fixture.componentInstance.placeholder = newPlaceholderValue;
            fixture.detectChanges();

            expect(directive.placeholder).toEqual(newPlaceholderValue);
            expect(nativeElement.placeholder).toEqual(newPlaceholderValue);
        });

        it('can be configured with attribute binding for errorText', () => {
            expect(directive.errorText).toBe('initial value');
            expect(nativeElement.errorText).toBe('initial value');

            fixture.componentInstance.errorText = 'new value';
            fixture.detectChanges();

            expect(directive.errorText).toBe('new value');
            expect(nativeElement.errorText).toBe('new value');
        });

        it('can be configured with attribute binding for errorVisible', () => {
            expect(directive.errorVisible).toBeFalse();
            expect(nativeElement.errorVisible).toBeFalse();

            fixture.componentInstance.errorVisible = '';
            fixture.detectChanges();

            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });
    });
});
