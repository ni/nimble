import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NimbleRichTextEditorModule } from '../nimble-rich-text-editor.module';
import { NimbleRichTextEditorDirective, RichTextEditor } from '../nimble-rich-text-editor.directive';

fdescribe('Nimble Rich Text Editor', () => {
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

    describe('with no markdown value set', () => {
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
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-rich-text-editor #editor
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
            nativeElement.setMarkdown('1. ***Numbered list with bold and italics***\n\n* ___Bulleted list with bold and italics___');
            fixture.detectChanges();
        });

        it('will use template string values for markdown', () => {
            expect(directive.getMarkdown()).toBe('1. ***Numbered list with bold and italics***\n\n* ***Bulleted list with bold and italics***');
            expect(nativeElement.getMarkdown()).toBe('1. ***Numbered list with bold and italics***\n\n* ***Bulleted list with bold and italics***');
        });
    });
});