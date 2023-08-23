import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef, ViewChild } from '@angular/core';
import type { BooleanValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
import { NimbleRichTextEditorModule } from '../nimble-rich-text-editor.module';
import { NimbleRichTextEditorDirective, RichTextEditor } from '../nimble-rich-text-editor.directive';

describe('Nimble Rich Text Editor', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleRichTextEditorModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-rich-text-editor')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-rich-text-editor #editor></nimble-rich-text-editor>
            `
        })
        class TestHostComponent {
            @ViewChild('editor', { read: NimbleRichTextEditorDirective }) public directive: NimbleRichTextEditorDirective;
            @ViewChild('editor', { read: ElementRef }) public elementRef: ElementRef<RichTextEditor>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRichTextEditorDirective;
        let nativeElement: RichTextEditor;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRichTextEditorModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for markdown', () => {
            expect(directive.getMarkdown()).toBe('');
            expect(nativeElement.getMarkdown()).toBe('');
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();
        });

        it('has expected defaults for footerHidden', () => {
            expect(directive.footerHidden).toBeFalse();
            expect(nativeElement.footerHidden).toBeFalse();
        });

        it('has expected defaults for fitToContent', () => {
            expect(directive.fitToContent).toBeFalse();
            expect(nativeElement.footerHidden).toBeFalse();
        });

        it('has expected defaults for errorVisible', () => {
            expect(directive.errorVisible).toBeFalse();
            expect(nativeElement.errorVisible).toBeFalse();
        });

        it('has expected defaults for errorText', () => {
            expect(directive.errorText).toBeUndefined();
            expect(nativeElement.errorText).toBeUndefined();
        });

        it('has expected defaults for placeholder', () => {
            expect(directive.placeholder).toBeUndefined();
            expect(nativeElement.placeholder).toBeUndefined();
        });

        it('has expected defaults for empty', () => {
            expect(directive.empty).toBeTrue();
            expect(nativeElement.empty).toBeTrue();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-rich-text-editor #editor
                    disabled
                    footer-hidden
                    fit-to-content
                    error-visible
                    error-text="Error text"
                    placeholder="Placeholder value"
                    >
                </nimble-rich-text-editor>`
        })
        class TestHostComponent {
            @ViewChild('editor', { read: NimbleRichTextEditorDirective }) public directive: NimbleRichTextEditorDirective;
            @ViewChild('editor', { read: ElementRef }) public elementRef: ElementRef<RichTextEditor>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRichTextEditorDirective;
        let nativeElement: RichTextEditor;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRichTextEditorModule]
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

        it('will use template string values for footerHidden', () => {
            expect(directive.footerHidden).toBeTrue();
            expect(nativeElement.footerHidden).toBeTrue();
        });

        it('will use template string values for fitToContent', () => {
            expect(directive.fitToContent).toBeTrue();
            expect(nativeElement.footerHidden).toBeTrue();
        });

        it('will use template string values for errorVisible', () => {
            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });

        it('will use template string values for errorText', () => {
            expect(directive.errorText).toBe('Error text');
            expect(nativeElement.errorText).toBe('Error text');
        });

        it('will use template string values for placeholder', () => {
            expect(directive.placeholder).toBe('Placeholder value');
            expect(nativeElement.placeholder).toBe('Placeholder value');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-rich-text-editor #editor
                    [disabled]="disabled"
                    [footer-hidden]="footerHidden"
                    [fit-to-content]="fitToContent"
                    [error-visible]="errorVisible"
                    [error-text]="errorText"
                    [placeholder]="placeholder"
                    >
                </nimble-rich-text-editor>`
        })
        class TestHostComponent {
            @ViewChild('editor', { read: NimbleRichTextEditorDirective }) public directive: NimbleRichTextEditorDirective;
            @ViewChild('editor', { read: ElementRef }) public elementRef: ElementRef<RichTextEditor>;
            public disabled = false;
            public footerHidden = false;
            public fitToContent = false;
            public errorVisible = false;
            public errorText = 'initial';
            public placeholder = 'initial';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRichTextEditorDirective;
        let nativeElement: RichTextEditor;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRichTextEditorModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
            nativeElement.setMarkdown('1. ***Numbered list with bold and italics***\n\n* ___Bulleted list with bold and italics___');
            fixture.detectChanges();
        });

        it('can be configured with method for markdown', () => {
            expect(directive.getMarkdown()).toBe('1. ***Numbered list with bold and italics***\n\n* ***Bulleted list with bold and italics***');
            expect(nativeElement.getMarkdown()).toBe('1. ***Numbered list with bold and italics***\n\n* ***Bulleted list with bold and italics***');

            nativeElement.setMarkdown('**Updated value**');
            fixture.detectChanges();

            expect(directive.getMarkdown()).toBe('**Updated value**');
            expect(nativeElement.getMarkdown()).toBe('**Updated value**');
        });

        it('can be configured with property binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = true;
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with property binding for footerHidden', () => {
            expect(directive.footerHidden).toBeFalse();
            expect(nativeElement.footerHidden).toBeFalse();

            fixture.componentInstance.footerHidden = true;
            fixture.detectChanges();

            expect(directive.footerHidden).toBeTrue();
            expect(nativeElement.footerHidden).toBeTrue();
        });

        it('can be configured with property binding for fitToContent', () => {
            expect(directive.fitToContent).toBeFalse();
            expect(nativeElement.fitToContent).toBeFalse();

            fixture.componentInstance.fitToContent = true;
            fixture.detectChanges();

            expect(directive.fitToContent).toBeTrue();
            expect(nativeElement.fitToContent).toBeTrue();
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

            fixture.componentInstance.errorText = 'updated error text';
            fixture.detectChanges();

            expect(directive.errorText).toBe('updated error text');
            expect(nativeElement.errorText).toBe('updated error text');
        });

        it('can be configured with property binding for placeholder', () => {
            expect(directive.placeholder).toBe('initial');
            expect(nativeElement.placeholder).toBe('initial');

            fixture.componentInstance.placeholder = 'updated placeholder value';
            fixture.detectChanges();

            expect(directive.placeholder).toBe('updated placeholder value');
            expect(nativeElement.placeholder).toBe('updated placeholder value');
        });

        it('can be configured with method for empty', () => {
            expect(directive.empty).toBeFalse();
            expect(nativeElement.empty).toBeFalse();

            nativeElement.setMarkdown('');
            fixture.detectChanges();

            expect(directive.empty).toBeTrue();
            expect(nativeElement.empty).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-rich-text-editor #editor
                    [attr.disabled]="disabled"
                    [attr.footer-hidden]="footerHidden"
                    [attr.fit-to-content]="fitToContent"
                    [attr.error-visible]="errorVisible"
                    [attr.error-text]="errorText"
                    [attr.placeholder]="placeholder"
                    >
                </nimble-rich-text-editor>`
        })
        class TestHostComponent {
            @ViewChild('editor', { read: NimbleRichTextEditorDirective }) public directive: NimbleRichTextEditorDirective;
            @ViewChild('editor', { read: ElementRef }) public elementRef: ElementRef<RichTextEditor>;
            public disabled: BooleanValueOrAttribute = null;
            public footerHidden: BooleanValueOrAttribute = null;
            public fitToContent: BooleanValueOrAttribute = null;
            public errorVisible: BooleanValueOrAttribute = null;
            public errorText = 'initial';
            public placeholder = 'initial';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRichTextEditorDirective;
        let nativeElement: RichTextEditor;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRichTextEditorModule]
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

        it('can be configured with attribute binding for footerHidden', () => {
            expect(directive.footerHidden).toBeFalse();
            expect(nativeElement.footerHidden).toBeFalse();

            fixture.componentInstance.footerHidden = '';
            fixture.detectChanges();

            expect(directive.footerHidden).toBeTrue();
            expect(nativeElement.footerHidden).toBeTrue();
        });

        it('can be configured with attribute binding for fitToContent', () => {
            expect(directive.fitToContent).toBeFalse();
            expect(nativeElement.fitToContent).toBeFalse();

            fixture.componentInstance.fitToContent = '';
            fixture.detectChanges();

            expect(directive.fitToContent).toBeTrue();
            expect(nativeElement.fitToContent).toBeTrue();
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

            fixture.componentInstance.errorText = 'updated error text';
            fixture.detectChanges();

            expect(directive.errorText).toBe('updated error text');
            expect(nativeElement.errorText).toBe('updated error text');
        });

        it('can be configured with attribute binding for placeholder', () => {
            expect(directive.placeholder).toBe('initial');
            expect(nativeElement.placeholder).toBe('initial');

            fixture.componentInstance.placeholder = 'updated placeholder value';
            fixture.detectChanges();

            expect(directive.placeholder).toBe('updated placeholder value');
            expect(nativeElement.placeholder).toBe('updated placeholder value');
        });
    });
});