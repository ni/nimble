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

        it('has expected defaults for markdownValue', () => {
            expect(directive.markdownValue).toBe('');
            expect(nativeElement.markdownValue).toBe('');
        });

        it('has expected defaults for fitToContent', () => {
            expect(directive.fitToContent).toBeFalse();
            expect(nativeElement.fitToContent).toBeFalse();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-rich-text-viewer #viewer
                    markdownValue="Markdown value"
                    fit-to-content
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

        it('will use template string values for markdownValue', () => {
            expect(directive.markdownValue).toBe('Markdown value');
            expect(nativeElement.markdownValue).toBe('Markdown value');
        });

        it('will use template string values for fiToContent', () => {
            expect(directive.fitToContent).toBeTrue();
            expect(nativeElement.fitToContent).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-rich-text-viewer #viewer
                    [markdownValue]="markdownValue"
                    [fitToContent]="fitToContent"
                    >
                </nimble-rich-text-viewer>`
        })
        class TestHostComponent {
            @ViewChild('viewer', { read: NimbleRichTextViewerDirective }) public directive: NimbleRichTextViewerDirective;
            @ViewChild('viewer', { read: ElementRef }) public elementRef: ElementRef<RichTextViewer>;
            public markdownValue = 'Markdown value';
            public fitToContent = false;
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

        it('can be configured with property binding for markdownValue', () => {
            expect(directive.markdownValue).toBe('Markdown value');
            expect(nativeElement.markdownValue).toBe('Markdown value');

            fixture.componentInstance.markdownValue = 'new markdown value';
            fixture.detectChanges();

            expect(directive.markdownValue).toBe('new markdown value');
            expect(nativeElement.markdownValue).toBe('new markdown value');
        });

        it('can be configured with property binding for fiToContent', () => {
            expect(directive.fitToContent).toBeFalse();
            expect(nativeElement.fitToContent).toBeFalse();

            fixture.componentInstance.fitToContent = true;
            fixture.detectChanges();

            expect(directive.fitToContent).toBeTrue();
            expect(nativeElement.fitToContent).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-rich-text-viewer #viewer
                    [attr.fit-to-content]="fitToContent">
                </nimble-rich-text-viewer>`
        })
        class TestHostComponent {
            @ViewChild('viewer', { read: NimbleRichTextViewerDirective }) public directive: NimbleRichTextViewerDirective;
            @ViewChild('viewer', { read: ElementRef }) public elementRef: ElementRef<RichTextViewer>;
            public fitToContent = false;
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

        it('can be configured with property binding for fitToContent', () => {
            expect(directive.fitToContent).toBeFalse();
            expect(nativeElement.fitToContent).toBeFalse();

            fixture.componentInstance.fitToContent = true;
            fixture.detectChanges();

            expect(directive.fitToContent).toBeTrue();
            expect(nativeElement.fitToContent).toBeTrue();
        });
    });
});