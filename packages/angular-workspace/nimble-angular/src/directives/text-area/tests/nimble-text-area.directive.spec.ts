import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { BooleanValueOrAttribute, NumberValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
import { NimbleTextAreaDirective, TextArea, TextAreaAppearance, TextAreaResize } from '../nimble-text-area.directive';
import { NimbleTextAreaModule } from '../nimble-text-area.module';

describe('Nimble text area', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleTextAreaModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-text-area')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-text-area #textArea></nimble-text-area>
            `
        })
        class TestHostComponent {
            @ViewChild('textArea', { read: NimbleTextAreaDirective }) public directive: NimbleTextAreaDirective;
            @ViewChild('textArea', { read: ElementRef }) public elementRef: ElementRef<TextArea>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTextAreaDirective;
        let nativeElement: TextArea;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTextAreaModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for appearance', () => {
            expect(directive.appearance).toBe(TextAreaAppearance.outline);
            expect(nativeElement.appearance).toBe(TextAreaAppearance.outline);
        });

        it('has expected defaults for readOnly', () => {
            expect(directive.readOnly).toBeUndefined();
            expect(nativeElement.readOnly).toBeUndefined();
        });

        it('has expected defaults for resize', () => {
            expect(directive.resize).toBe(TextAreaResize.none);
            expect(nativeElement.resize).toBe(TextAreaResize.none);
        });

        it('has expected defaults for autofocus', () => {
            expect(directive.autofocus).toBeUndefined();
            expect(nativeElement.autofocus).toBeUndefined();
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();
        });

        it('has expected defaults for required', () => {
            expect(directive.required).toBeFalse();
            expect(nativeElement.required).toBeFalse();
        });

        it('has expected defaults for formId', () => {
            expect(directive.formId).toBeUndefined();
            expect(nativeElement.formId).toBeUndefined();
        });

        it('has expected defaults for maxlength', () => {
            expect(directive.maxlength).toBeUndefined();
            expect(nativeElement.maxlength).toBeUndefined();
        });

        it('has expected defaults for minlength', () => {
            expect(directive.minlength).toBeUndefined();
            expect(nativeElement.minlength).toBeUndefined();
        });

        it('has expected defaults for placeholder', () => {
            expect(directive.placeholder).toBeUndefined();
            expect(nativeElement.placeholder).toBeUndefined();
        });

        it('has expected defaults for cols', () => {
            expect(directive.cols).toBe(20);
            expect(nativeElement.cols).toBe(20);
        });

        it('has expected defaults for rows', () => {
            expect(directive.rows).toBeUndefined();
            expect(nativeElement.rows).toBeUndefined();
        });

        it('has expected defaults for spellcheck', () => {
            expect(directive.spellcheck).toBeUndefined();
            expect(nativeElement.spellcheck).toBeUndefined();
        });

        it('has expected defaults for errorVisible', () => {
            expect(directive.errorVisible).toBeFalse();
            expect(nativeElement.errorVisible).toBeFalse();
        });

        it('has expected defaults for errorText', () => {
            expect(directive.errorText).toBeUndefined();
            expect(nativeElement.errorText).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-text-area #textArea
                    appearance="${TextAreaAppearance.block}"
                    readonly
                    resize="${TextAreaResize.horizontal}"
                    autofocus
                    disabled
                    required
                    error-visible
                    error-text="Error text"
                    form="foo"
                    maxlength="100"
                    minlength="20"
                    placeholder="Placeholder value"
                    cols="10"
                    rows="6"
                    spellcheck>
                </nimble-text-area>`
        })
        class TestHostComponent {
            @ViewChild('textArea', { read: NimbleTextAreaDirective }) public directive: NimbleTextAreaDirective;
            @ViewChild('textArea', { read: ElementRef }) public elementRef: ElementRef<TextArea>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTextAreaDirective;
        let nativeElement: TextArea;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTextAreaModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for appearance', () => {
            expect(directive.appearance).toBe(TextAreaAppearance.block);
            expect(nativeElement.appearance).toBe(TextAreaAppearance.block);
        });

        it('will use template string values for readOnly', () => {
            expect(directive.readOnly).toBeTrue();
            expect(nativeElement.readOnly).toBeTrue();
        });

        it('will use template string values for resize', () => {
            expect(directive.resize).toBe(TextAreaResize.horizontal);
            expect(nativeElement.resize).toBe(TextAreaResize.horizontal);
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

        it('will use template string values for formId', () => {
            expect(directive.formId).toBe('foo');
            expect(nativeElement.formId).toBe('foo');
        });

        it('will use template string values for maxlength', () => {
            expect(directive.maxlength).toBe(100);
            expect(nativeElement.maxlength).toBe(100);
        });

        it('will use template string values for minlength', () => {
            expect(directive.minlength).toBe(20);
            expect(nativeElement.minlength).toBe(20);
        });

        it('will use template string values for placeholder', () => {
            expect(directive.placeholder).toBe('Placeholder value');
            expect(nativeElement.placeholder).toBe('Placeholder value');
        });

        it('will use template string values for cols', () => {
            expect(directive.cols).toBe(10);
            expect(nativeElement.cols).toBe(10);
        });

        it('will use template string values for rows', () => {
            expect(directive.rows).toBe(6);
            expect(nativeElement.rows).toBe(6);
        });

        it('will use template string values for spellcheck', () => {
            expect(directive.spellcheck).toBeTrue();
            expect(nativeElement.spellcheck).toBeTrue();
        });

        it('will use template string values for errorVisible', () => {
            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });

        it('will use template string values for errorText', () => {
            expect(directive.errorText).toBe('Error text');
            expect(nativeElement.errorText).toBe('Error text');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-text-area #textArea
                    [appearance]="appearance"
                    [readonly]="readonly"
                    [resize]="resize"
                    [autofocus]="autofocus"
                    [disabled]="disabled"
                    [required]="required"
                    [error-visible]="errorVisible"
                    [error-text]="errorText"
                    [form]="form"
                    [maxlength]="maxlength"
                    [minlength]="minlength"
                    [placeholder]="placeholder"
                    [cols]="cols"
                    [rows]="rows"
                    [spellcheck]="spellcheck">
                </nimble-text-area>`
        })
        class TestHostComponent {
            @ViewChild('textArea', { read: NimbleTextAreaDirective }) public directive: NimbleTextAreaDirective;
            @ViewChild('textArea', { read: ElementRef }) public elementRef: ElementRef<TextArea>;
            public appearance: TextAreaAppearance = TextAreaAppearance.block;
            public readonly = false;
            public resize: TextAreaResize = TextAreaResize.horizontal;
            public autofocus = false;
            public disabled = false;
            public required = false;
            public errorVisible = false;
            public errorText = 'initial';
            public form = 'initial';
            public maxlength = 10;
            public minlength = 5;
            public placeholder = 'initial';
            public cols = 5;
            public rows = 2;
            public spellcheck = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTextAreaDirective;
        let nativeElement: TextArea;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTextAreaModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for appearance', () => {
            expect(directive.appearance).toBe(TextAreaAppearance.block);
            expect(nativeElement.appearance).toBe(TextAreaAppearance.block);

            fixture.componentInstance.appearance = TextAreaAppearance.outline;
            fixture.detectChanges();

            expect(directive.appearance).toBe(TextAreaAppearance.outline);
            expect(nativeElement.appearance).toBe(TextAreaAppearance.outline);
        });

        it('can be configured with property binding for readOnly', () => {
            expect(directive.readOnly).toBeFalse();
            expect(nativeElement.readOnly).toBeFalse();

            fixture.componentInstance.readonly = true;
            fixture.detectChanges();

            expect(directive.readOnly).toBeTrue();
            expect(nativeElement.readOnly).toBeTrue();
        });

        it('can be configured with property binding for resize', () => {
            expect(directive.resize).toBe(TextAreaResize.horizontal);
            expect(nativeElement.resize).toBe(TextAreaResize.horizontal);

            fixture.componentInstance.resize = TextAreaResize.both;
            fixture.detectChanges();

            expect(directive.resize).toBe(TextAreaResize.both);
            expect(nativeElement.resize).toBe(TextAreaResize.both);
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

        it('can be configured with property binding for formId', () => {
            expect(directive.formId).toBe('initial');
            expect(nativeElement.formId).toBe('initial');

            fixture.componentInstance.form = 'foo';
            fixture.detectChanges();

            expect(directive.formId).toBe('foo');
            expect(nativeElement.formId).toBe('foo');
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

        it('can be configured with property binding for placeholder', () => {
            expect(directive.placeholder).toBe('initial');
            expect(nativeElement.placeholder).toBe('initial');

            fixture.componentInstance.placeholder = 'ph';
            fixture.detectChanges();

            expect(directive.placeholder).toBe('ph');
            expect(nativeElement.placeholder).toBe('ph');
        });

        it('can be configured with property binding for cols', () => {
            expect(directive.cols).toBe(5);
            expect(nativeElement.cols).toBe(5);

            fixture.componentInstance.cols = 55;
            fixture.detectChanges();

            expect(directive.cols).toBe(55);
            expect(nativeElement.cols).toBe(55);
        });

        it('can be configured with property binding for rows', () => {
            expect(directive.rows).toBe(2);
            expect(nativeElement.rows).toBe(2);

            fixture.componentInstance.rows = 20;
            fixture.detectChanges();

            expect(directive.rows).toBe(20);
            expect(nativeElement.rows).toBe(20);
        });

        it('can be configured with property binding for spellcheck', () => {
            expect(directive.spellcheck).toBeFalse();
            expect(nativeElement.spellcheck).toBeFalse();

            fixture.componentInstance.spellcheck = true;
            fixture.detectChanges();

            expect(directive.spellcheck).toBeTrue();
            expect(nativeElement.spellcheck).toBeTrue();
        });

        it('can be configured with property binding for errorVisible', () => {
            expect(directive.errorVisible).toBeFalse();
            expect(nativeElement.errorVisible).toBeFalse();

            fixture.componentInstance.errorVisible = true;
            fixture.detectChanges();

            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });

        it('can be configured with property binding for errorText', () => {
            expect(directive.errorText).toBe('initial');
            expect(nativeElement.errorText).toBe('initial');

            fixture.componentInstance.errorText = 'et';
            fixture.detectChanges();

            expect(directive.errorText).toBe('et');
            expect(nativeElement.errorText).toBe('et');
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-text-area #textArea
                    [attr.appearance]="appearance"
                    [attr.readonly]="readonly"
                    [attr.resize]="resize"
                    [attr.autofocus]="autofocus"
                    [attr.disabled]="disabled"
                    [attr.required]="required"
                    [attr.error-visible]="errorVisible"
                    [attr.error-text]="errorText"
                    [attr.form]="form"
                    [attr.maxlength]="maxlength"
                    [attr.minlength]="minlength"
                    [attr.placeholder]="placeholder"
                    [attr.cols]="cols"
                    [attr.rows]="rows"
                    [attr.spellcheck]="spellcheck">
                </nimble-text-area>`
        })
        class TestHostComponent {
            @ViewChild('textArea', { read: NimbleTextAreaDirective }) public directive: NimbleTextAreaDirective;
            @ViewChild('textArea', { read: ElementRef }) public elementRef: ElementRef<TextArea>;
            public appearance: TextAreaAppearance = TextAreaAppearance.block;
            public readonly: BooleanValueOrAttribute = null;
            public resize: TextAreaResize = TextAreaResize.horizontal;
            public autofocus: BooleanValueOrAttribute = null;
            public disabled: BooleanValueOrAttribute = null;
            public required: BooleanValueOrAttribute = null;
            public errorVisible: BooleanValueOrAttribute = null;
            public errorText = 'initial';
            public form = 'initial';
            public maxlength: NumberValueOrAttribute = 10;
            public minlength: NumberValueOrAttribute = 5;
            public placeholder = 'initial';
            public cols: NumberValueOrAttribute = 5;
            public rows: NumberValueOrAttribute = 2;
            public spellcheck: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTextAreaDirective;
        let nativeElement: TextArea;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTextAreaModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for appearance', () => {
            expect(directive.appearance).toBe(TextAreaAppearance.block);
            expect(nativeElement.appearance).toBe(TextAreaAppearance.block);

            fixture.componentInstance.appearance = TextAreaAppearance.outline;
            fixture.detectChanges();

            expect(directive.appearance).toBe(TextAreaAppearance.outline);
            expect(nativeElement.appearance).toBe(TextAreaAppearance.outline);
        });

        it('can be configured with attribute binding for readOnly', () => {
            expect(directive.readOnly).toBeUndefined();
            expect(nativeElement.readOnly).toBeUndefined();

            fixture.componentInstance.readonly = '';
            fixture.detectChanges();

            expect(directive.readOnly).toBeTrue();
            expect(nativeElement.readOnly).toBeTrue();
        });

        it('can be configured with attribute binding for resize', () => {
            expect(directive.resize).toBe(TextAreaResize.horizontal);
            expect(nativeElement.resize).toBe(TextAreaResize.horizontal);

            fixture.componentInstance.resize = TextAreaResize.both;
            fixture.detectChanges();

            expect(directive.resize).toBe(TextAreaResize.both);
            expect(nativeElement.resize).toBe(TextAreaResize.both);
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

        it('can be configured with attribute binding for formId', () => {
            expect(directive.formId).toBe('initial');
            expect(nativeElement.formId).toBe('initial');

            fixture.componentInstance.form = 'foo';
            fixture.detectChanges();

            expect(directive.formId).toBe('foo');
            expect(nativeElement.formId).toBe('foo');
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

        it('can be configured with attribute binding for placeholder', () => {
            expect(directive.placeholder).toBe('initial');
            expect(nativeElement.placeholder).toBe('initial');

            fixture.componentInstance.placeholder = 'ph';
            fixture.detectChanges();

            expect(directive.placeholder).toBe('ph');
            expect(nativeElement.placeholder).toBe('ph');
        });

        it('can be configured with attribute binding for cols', () => {
            expect(directive.cols).toBe(5);
            expect(nativeElement.cols).toBe(5);

            fixture.componentInstance.cols = 55;
            fixture.detectChanges();

            expect(directive.cols).toBe(55);
            expect(nativeElement.cols).toBe(55);
        });

        it('can be configured with attribute binding for rows', () => {
            expect(directive.rows).toBe(2);
            expect(nativeElement.rows).toBe(2);

            fixture.componentInstance.rows = 20;
            fixture.detectChanges();

            expect(directive.rows).toBe(20);
            expect(nativeElement.rows).toBe(20);
        });

        it('can be configured with attribute binding for spellcheck', () => {
            expect(directive.spellcheck).toBeUndefined();
            expect(nativeElement.spellcheck).toBeUndefined();

            fixture.componentInstance.spellcheck = '';
            fixture.detectChanges();

            expect(directive.spellcheck).toBeTrue();
            expect(nativeElement.spellcheck).toBeTrue();
        });

        it('can be configured with attribute binding for errorVisible', () => {
            expect(directive.errorVisible).toBeFalse();
            expect(nativeElement.errorVisible).toBeFalse();

            fixture.componentInstance.errorVisible = '';
            fixture.detectChanges();

            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });

        it('can be configured with attribute binding for errorText', () => {
            expect(directive.errorText).toBe('initial');
            expect(nativeElement.errorText).toBe('initial');

            fixture.componentInstance.errorText = 'foo';
            fixture.detectChanges();

            expect(directive.errorText).toBe('foo');
            expect(nativeElement.errorText).toBe('foo');
        });
    });
});