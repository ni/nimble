import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleTextFieldModule } from '../nimble-text-field.module';
import { NimbleTextFieldDirective, TextField, TextFieldAppearance, TextFieldType } from '../nimble-text-field.directive';
import type { BooleanValueOrAttribute, NumberValueOrAttribute } from '../../utilities/template-value-helpers';

describe('Nimble text field', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleTextFieldModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-text-field')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-text-field #textField></nimble-text-field>
            `
        })
        class TestHostComponent {
            @ViewChild('textField', { read: NimbleTextFieldDirective }) public directive: NimbleTextFieldDirective;
            @ViewChild('textField', { read: ElementRef }) public elementRef: ElementRef<TextField>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTextFieldDirective;
        let nativeElement: TextField;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTextFieldModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for appearance', () => {
            expect(directive.appearance).toBe(TextFieldAppearance.underline);
            expect(nativeElement.appearance).toBe(TextFieldAppearance.underline);
        });

        it('can use the directive to set appearance', () => {
            directive.appearance = TextFieldAppearance.block;
            expect(nativeElement.appearance).toBe(TextFieldAppearance.block);
        });

        it('has expected defaults for readOnly', () => {
            expect(directive.readOnly).toBeUndefined();
            expect(nativeElement.readOnly).toBeUndefined();
        });

        it('can use the directive to set readOnly', () => {
            directive.readOnly = true;
            expect(nativeElement.readOnly).toBeTrue();
        });

        it('has expected defaults for type', () => {
            expect(directive.type).toBe(TextFieldType.text);
            expect(nativeElement.type).toBe(TextFieldType.text);
        });

        it('can use the directive to set type', () => {
            directive.type = TextFieldType.password;
            expect(nativeElement.type).toBe(TextFieldType.password);
        });

        it('has expected defaults for autofocus', () => {
            expect(directive.autofocus).toBeUndefined();
            expect(nativeElement.autofocus).toBeUndefined();
        });

        it('can use the directive to set autofocus', () => {
            directive.autofocus = true;
            expect(nativeElement.autofocus).toBeTrue();
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();
        });

        it('can use the directive to set disabled', () => {
            directive.disabled = true;
            expect(nativeElement.disabled).toBeTrue();
        });

        it('has expected defaults for required', () => {
            expect(directive.required).toBeFalse();
            expect(nativeElement.required).toBeFalse();
        });

        it('can use the directive to set required', () => {
            directive.required = true;
            expect(nativeElement.required).toBeTrue();
        });

        it('has expected defaults for placeholder', () => {
            expect(directive.placeholder).toBeUndefined();
            expect(nativeElement.placeholder).toBeUndefined();
        });

        it('can use the directive to set placeholder', () => {
            directive.placeholder = 'Put stuff here';
            expect(nativeElement.placeholder).toBe('Put stuff here');
        });

        it('has expected defaults for maxlength', () => {
            expect(directive.maxlength).toBeUndefined();
            expect(nativeElement.maxlength).toBeUndefined();
        });

        it('can use the directive to set maxlength', () => {
            directive.maxlength = 100;
            expect(nativeElement.maxlength).toBe(100);
        });

        it('has expected defaults for minlength', () => {
            expect(directive.minlength).toBeUndefined();
            expect(nativeElement.minlength).toBeUndefined();
        });

        it('can use the directive to set minlength', () => {
            directive.minlength = 20;
            expect(nativeElement.minlength).toBe(20);
        });

        it('has expected defaults for pattern', () => {
            expect(directive.pattern).toBeUndefined();
            expect(nativeElement.pattern).toBeUndefined();
        });

        it('can use the directive to set pattern', () => {
            directive.pattern = 'foo *';
            expect(nativeElement.pattern).toBe('foo *');
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

        it('has expected defaults for size', () => {
            expect(directive.size).toBeUndefined();
            expect(nativeElement.size).toBeUndefined();
        });

        it('can use the directive to set size', () => {
            directive.size = 20;
            expect(nativeElement.size).toBe(20);
        });

        it('has expected defaults for spellcheck', () => {
            expect(directive.spellcheck).toBeUndefined();
            expect(nativeElement.spellcheck).toBeUndefined();
        });

        it('can use the directive to set spellcheck', () => {
            directive.spellcheck = true;
            expect(nativeElement.spellcheck).toBeTrue();
        });

        it('has expected defaults for fullBleed', () => {
            expect(directive.fullBleed).toBeFalse();
            expect(nativeElement.fullBleed).toBeFalse();
        });

        it('can use the directive to set fullBleed', () => {
            directive.fullBleed = true;
            expect(nativeElement.fullBleed).toBeTrue();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-text-field #textField
                    appearance="${TextFieldAppearance.block}"
                    readonly
                    type="${TextFieldType.password}"
                    autofocus
                    disabled
                    required
                    placeholder="Placeholder value"
                    maxlength="100"
                    minlength="20"
                    pattern="foo *"
                    error-text="error text"
                    error-visible
                    size="10"
                    spellcheck
                    full-bleed
                >
                </nimble-text-field>`
        })
        class TestHostComponent {
            @ViewChild('textField', { read: NimbleTextFieldDirective }) public directive: NimbleTextFieldDirective;
            @ViewChild('textField', { read: ElementRef }) public elementRef: ElementRef<TextField>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTextFieldDirective;
        let nativeElement: TextField;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTextFieldModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for appearance', () => {
            expect(directive.appearance).toBe(TextFieldAppearance.block);
            expect(nativeElement.appearance).toBe(TextFieldAppearance.block);
        });

        it('will use template string values for readOnly', () => {
            expect(directive.readOnly).toBeTrue();
            expect(nativeElement.readOnly).toBeTrue();
        });

        it('will use template string values for type', () => {
            expect(directive.type).toBe(TextFieldType.password);
            expect(nativeElement.type).toBe(TextFieldType.password);
        });

        it('will use template string values for autofocus', () => {
            expect(directive.autofocus).toBeTrue();
            expect(nativeElement.autofocus).toBeTrue();
        });

        it('will use template string values for disabled', () => {
            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('will use template string values for required', () => {
            expect(directive.required).toBeTrue();
            expect(nativeElement.required).toBeTrue();
        });

        it('will use template string values for placeholder', () => {
            expect(directive.placeholder).toBe('Placeholder value');
            expect(nativeElement.placeholder).toBe('Placeholder value');
        });

        it('will use template string values for maxlength', () => {
            expect(directive.maxlength).toBe(100);
            expect(nativeElement.maxlength).toBe(100);
        });

        it('will use template string values for minlength', () => {
            expect(directive.minlength).toBe(20);
            expect(nativeElement.minlength).toBe(20);
        });

        it('will use template string values for pattern', () => {
            expect(directive.pattern).toBe('foo *');
            expect(nativeElement.pattern).toBe('foo *');
        });

        it('will use template string values for errorText', () => {
            expect(directive.errorText).toBe('error text');
            expect(nativeElement.errorText).toBe('error text');
        });

        it('will use template string values for errorVisible', () => {
            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });

        it('will use template string values for size', () => {
            expect(directive.size).toBe(10);
            expect(nativeElement.size).toBe(10);
        });

        it('will use template string values for spellcheck', () => {
            expect(directive.spellcheck).toBeTrue();
            expect(nativeElement.spellcheck).toBeTrue();
        });

        it('will use template string values for fullBleed', () => {
            expect(directive.fullBleed).toBeTrue();
            expect(nativeElement.fullBleed).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-text-field #textField
                    [appearance]="appearance"
                    [readonly]="readonly"
                    [type]="type"
                    [autofocus]="autofocus"
                    [disabled]="disabled"
                    [required]="required"
                    [placeholder]="placeholder"
                    [maxlength]="maxlength"
                    [minlength]="minlength"
                    [pattern]="pattern"
                    [error-text]="errorText"
                    [error-visible]="errorVisible"
                    [size]="size"
                    [spellcheck]="spellcheck"
                    [full-bleed]="fullBleed"
                >
                </nimble-text-field>`
        })
        class TestHostComponent {
            @ViewChild('textField', { read: NimbleTextFieldDirective }) public directive: NimbleTextFieldDirective;
            @ViewChild('textField', { read: ElementRef }) public elementRef: ElementRef<TextField>;
            public appearance: TextFieldAppearance = TextFieldAppearance.block;
            public readonly = false;
            public type: TextFieldType = TextFieldType.password;
            public autofocus = false;
            public disabled = false;
            public required = false;
            public placeholder = 'initial';
            public maxlength = 10;
            public minlength = 5;
            public pattern = 'initial';
            public errorText = 'initial value';
            public errorVisible = false;
            public size = 2;
            public spellcheck = false;
            public fullBleed = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTextFieldDirective;
        let nativeElement: TextField;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTextFieldModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for appearance', () => {
            expect(directive.appearance).toBe(TextFieldAppearance.block);
            expect(nativeElement.appearance).toBe(TextFieldAppearance.block);

            fixture.componentInstance.appearance = TextFieldAppearance.outline;
            fixture.detectChanges();

            expect(directive.appearance).toBe(TextFieldAppearance.outline);
            expect(nativeElement.appearance).toBe(TextFieldAppearance.outline);
        });

        it('can be configured with property binding for readOnly', () => {
            expect(directive.readOnly).toBeFalse();
            expect(nativeElement.readOnly).toBeFalse();

            fixture.componentInstance.readonly = true;
            fixture.detectChanges();

            expect(directive.readOnly).toBeTrue();
            expect(nativeElement.readOnly).toBeTrue();
        });

        it('can be configured with property binding for type', () => {
            expect(directive.type).toBe(TextFieldType.password);
            expect(nativeElement.type).toBe(TextFieldType.password);

            fixture.componentInstance.type = TextFieldType.email;
            fixture.detectChanges();

            expect(directive.type).toBe(TextFieldType.email);
            expect(nativeElement.type).toBe(TextFieldType.email);
        });

        it('can be configured with property binding for autofocus', () => {
            expect(directive.autofocus).toBeFalse();
            expect(nativeElement.autofocus).toBeFalse();

            fixture.componentInstance.autofocus = true;
            fixture.detectChanges();

            expect(directive.autofocus).toBeTrue();
            expect(nativeElement.autofocus).toBeTrue();
        });

        it('can be configured with property binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = true;
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with property binding for required', () => {
            expect(directive.required).toBeFalse();
            expect(nativeElement.required).toBeFalse();

            fixture.componentInstance.required = true;
            fixture.detectChanges();

            expect(directive.required).toBeTrue();
            expect(nativeElement.required).toBeTrue();
        });

        it('can be configured with property binding for placeholder', () => {
            expect(directive.placeholder).toBe('initial');
            expect(nativeElement.placeholder).toBe('initial');

            fixture.componentInstance.placeholder = 'ph';
            fixture.detectChanges();

            expect(directive.placeholder).toBe('ph');
            expect(nativeElement.placeholder).toBe('ph');
        });

        it('can be configured with property binding for maxlength', () => {
            expect(directive.maxlength).toBe(10);
            expect(nativeElement.maxlength).toBe(10);

            fixture.componentInstance.maxlength = 123;
            fixture.detectChanges();

            expect(directive.maxlength).toBe(123);
            expect(nativeElement.maxlength).toBe(123);
        });

        it('can be configured with property binding for minlength', () => {
            expect(directive.minlength).toBe(5);
            expect(nativeElement.minlength).toBe(5);

            fixture.componentInstance.minlength = 7;
            fixture.detectChanges();

            expect(directive.minlength).toBe(7);
            expect(nativeElement.minlength).toBe(7);
        });

        it('can be configured with property binding for pattern', () => {
            expect(directive.pattern).toBe('initial');
            expect(nativeElement.pattern).toBe('initial');

            fixture.componentInstance.pattern = 'new value';
            fixture.detectChanges();

            expect(directive.pattern).toBe('new value');
            expect(nativeElement.pattern).toBe('new value');
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

        it('can be configured with property binding for size', () => {
            expect(directive.size).toBe(2);
            expect(nativeElement.size).toBe(2);

            fixture.componentInstance.size = 20;
            fixture.detectChanges();

            expect(directive.size).toBe(20);
            expect(nativeElement.size).toBe(20);
        });

        it('can be configured with property binding for spellcheck', () => {
            expect(directive.spellcheck).toBeFalse();
            expect(nativeElement.spellcheck).toBeFalse();

            fixture.componentInstance.spellcheck = true;
            fixture.detectChanges();

            expect(directive.spellcheck).toBeTrue();
            expect(nativeElement.spellcheck).toBeTrue();
        });

        it('can be configured with property binding for fullBleed', () => {
            expect(directive.fullBleed).toBeFalse();
            expect(nativeElement.fullBleed).toBeFalse();

            fixture.componentInstance.fullBleed = true;
            fixture.detectChanges();

            expect(directive.fullBleed).toBeTrue();
            expect(nativeElement.fullBleed).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-text-field #textField
                    [attr.appearance]="appearance"
                    [attr.readonly]="readonly"
                    [attr.type]="type"
                    [attr.autofocus]="autofocus"
                    [attr.disabled]="disabled"
                    [attr.required]="required"
                    [attr.placeholder]="placeholder"
                    [attr.maxlength]="maxlength"
                    [attr.minlength]="minlength"
                    [attr.pattern]="pattern"
                    [attr.error-text]="errorText"
                    [attr.error-visible]="errorVisible"
                    [attr.size]="size"
                    [attr.spellcheck]="spellcheck"
                    [attr.full-bleed]="fullBleed"
                >
                </nimble-text-field>`
        })
        class TestHostComponent {
            @ViewChild('textField', { read: NimbleTextFieldDirective }) public directive: NimbleTextFieldDirective;
            @ViewChild('textField', { read: ElementRef }) public elementRef: ElementRef<TextField>;
            public appearance: TextFieldAppearance = TextFieldAppearance.block;
            public readonly: BooleanValueOrAttribute = null;
            public type: TextFieldType = TextFieldType.password;
            public autofocus: BooleanValueOrAttribute = null;
            public disabled: BooleanValueOrAttribute = null;
            public required: BooleanValueOrAttribute = null;
            public placeholder = 'initial';
            public maxlength: NumberValueOrAttribute = 10;
            public minlength: NumberValueOrAttribute = 5;
            public pattern = 'initial';
            public errorText = 'initial value';
            public errorVisible: BooleanValueOrAttribute = null;
            public size: NumberValueOrAttribute = 2;
            public spellcheck: BooleanValueOrAttribute = null;
            public fullBleed: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTextFieldDirective;
        let nativeElement: TextField;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTextFieldModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for appearance', () => {
            expect(directive.appearance).toBe(TextFieldAppearance.block);
            expect(nativeElement.appearance).toBe(TextFieldAppearance.block);

            fixture.componentInstance.appearance = TextFieldAppearance.outline;
            fixture.detectChanges();

            expect(directive.appearance).toBe(TextFieldAppearance.outline);
            expect(nativeElement.appearance).toBe(TextFieldAppearance.outline);
        });

        it('can be configured with attribute binding for readOnly', () => {
            expect(directive.readOnly).toBeUndefined();
            expect(nativeElement.readOnly).toBeUndefined();

            fixture.componentInstance.readonly = '';
            fixture.detectChanges();

            expect(directive.readOnly).toBeTrue();
            expect(nativeElement.readOnly).toBeTrue();
        });

        it('can be configured with attribute binding for type', () => {
            expect(directive.type).toBe(TextFieldType.password);
            expect(nativeElement.type).toBe(TextFieldType.password);

            fixture.componentInstance.type = TextFieldType.email;
            fixture.detectChanges();

            expect(directive.type).toBe(TextFieldType.email);
            expect(nativeElement.type).toBe(TextFieldType.email);
        });

        it('can be configured with attribute binding for autofocus', () => {
            expect(directive.autofocus).toBeUndefined();
            expect(nativeElement.autofocus).toBeUndefined();

            fixture.componentInstance.autofocus = '';
            fixture.detectChanges();

            expect(directive.autofocus).toBeTrue();
            expect(nativeElement.autofocus).toBeTrue();
        });

        it('can be configured with attribute binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = '';
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with attribute binding for required', () => {
            expect(directive.required).toBeFalse();
            expect(nativeElement.required).toBeFalse();

            fixture.componentInstance.required = '';
            fixture.detectChanges();

            expect(directive.required).toBeTrue();
            expect(nativeElement.required).toBeTrue();
        });

        it('can be configured with attribute binding for placeholder', () => {
            expect(directive.placeholder).toBe('initial');
            expect(nativeElement.placeholder).toBe('initial');

            fixture.componentInstance.placeholder = 'ph';
            fixture.detectChanges();

            expect(directive.placeholder).toBe('ph');
            expect(nativeElement.placeholder).toBe('ph');
        });

        it('can be configured with attribute binding for maxlength', () => {
            expect(directive.maxlength).toBe(10);
            expect(nativeElement.maxlength).toBe(10);

            fixture.componentInstance.maxlength = 123;
            fixture.detectChanges();

            expect(directive.maxlength).toBe(123);
            expect(nativeElement.maxlength).toBe(123);
        });

        it('can be configured with attribute binding for minlength', () => {
            expect(directive.minlength).toBe(5);
            expect(nativeElement.minlength).toBe(5);

            fixture.componentInstance.minlength = 7;
            fixture.detectChanges();

            expect(directive.minlength).toBe(7);
            expect(nativeElement.minlength).toBe(7);
        });

        it('can be configured with attribute binding for pattern', () => {
            expect(directive.pattern).toBe('initial');
            expect(nativeElement.pattern).toBe('initial');

            fixture.componentInstance.pattern = 'new pattern';
            fixture.detectChanges();

            expect(directive.pattern).toBe('new pattern');
            expect(nativeElement.pattern).toBe('new pattern');
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

        it('can be configured with attribute binding for size', () => {
            expect(directive.size).toBe(2);
            expect(nativeElement.size).toBe(2);

            fixture.componentInstance.size = 20;
            fixture.detectChanges();

            expect(directive.size).toBe(20);
            expect(nativeElement.size).toBe(20);
        });

        it('can be configured with attribute binding for spellcheck', () => {
            expect(directive.spellcheck).toBeUndefined();
            expect(nativeElement.spellcheck).toBeUndefined();

            fixture.componentInstance.spellcheck = '';
            fixture.detectChanges();

            expect(directive.spellcheck).toBeTrue();
            expect(nativeElement.spellcheck).toBeTrue();
        });

        it('can be configured with attribute binding for fullBleed', () => {
            expect(directive.fullBleed).toBeFalse();
            expect(nativeElement.fullBleed).toBeFalse();

            fixture.componentInstance.fullBleed = '';
            fixture.detectChanges();

            expect(directive.fullBleed).toBeTrue();
            expect(nativeElement.fullBleed).toBeTrue();
        });
    });
});
