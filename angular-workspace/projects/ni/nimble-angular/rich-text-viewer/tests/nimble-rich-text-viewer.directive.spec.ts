import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NimbleRichTextViewerModule } from '../nimble-rich-text-viewer.module';
import { NimbleRichTextViewerDirective, RichTextViewer } from '../nimble-rich-text-viewer.directive';

describe('Nimble Rich Text Viewer', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleRichTextViewerModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-rich-text-viewer')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-rich-text-viewer #viewer></nimble-rich-text-viewer>
            `
        })
        class TestHostComponent {
            @ViewChild('viewer', { read: NimbleRichTextViewerDirective }) public directive: NimbleRichTextViewerDirective;
            @ViewChild('viewer', { read: ElementRef }) public elementRef: ElementRef<RichTextViewer>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRichTextViewerDirective;
        let nativeElement: RichTextViewer;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRichTextViewerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for markdown', () => {
            expect(directive.markdown).toBe('');
            expect(nativeElement.markdown).toBe('');
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-rich-text-viewer #viewer
                    markdown="**Bold** _Italics_ \n\n1. \n2. \n * \n * \n"
                    >
                </nimble-rich-text-viewer>`
        })
        class TestHostComponent {
            @ViewChild('viewer', { read: NimbleRichTextViewerDirective }) public directive: NimbleRichTextViewerDirective;
            @ViewChild('viewer', { read: ElementRef }) public elementRef: ElementRef<RichTextViewer>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRichTextViewerDirective;
        let nativeElement: RichTextViewer;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRichTextViewerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for markdown', () => {
            expect(directive.markdown).toBe('**Bold** _Italics_ \n\n1. \n2. \n * \n * \n');
            expect(nativeElement.markdown).toBe('**Bold** _Italics_ \n\n1. \n2. \n * \n * \n');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-rich-text-viewer #viewer
                    [markdown]="markdown"
                    >
                </nimble-rich-text-viewer>`
        })
        class TestHostComponent {
            @ViewChild('viewer', { read: NimbleRichTextViewerDirective }) public directive: NimbleRichTextViewerDirective;
            @ViewChild('viewer', { read: ElementRef }) public elementRef: ElementRef<RichTextViewer>;
            public markdown = '**Bold** _Italics_ \n\n1. \n2. \n * \n * \n';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRichTextViewerDirective;
        let nativeElement: RichTextViewer;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRichTextViewerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for markdown', () => {
            expect(directive.markdown).toBe('**Bold** _Italics_ \n\n1. \n2. \n * \n * \n');
            expect(nativeElement.markdown).toBe('**Bold** _Italics_ \n\n1. \n2. \n * \n * \n');

            fixture.componentInstance.markdown = '***new markdown value***';
            fixture.detectChanges();

            expect(directive.markdown).toBe('***new markdown value***');
            expect(nativeElement.markdown).toBe('***new markdown value***');
        });

        it('can be configured with property binding for markdown in a string literals', () => {
            expect(directive.markdown).toBe('**Bold** _Italics_ \n\n1. \n2. \n * \n * \n');
            expect(nativeElement.markdown).toBe('**Bold** _Italics_ \n\n1. \n2. \n * \n * \n');

            fixture.componentInstance.markdown = `New value

            New line`;
            fixture.detectChanges();

            expect(directive.markdown).toBe(`New value

            New line`);
            expect(nativeElement.markdown).toBe(`New value

            New line`);
        });
    });
});