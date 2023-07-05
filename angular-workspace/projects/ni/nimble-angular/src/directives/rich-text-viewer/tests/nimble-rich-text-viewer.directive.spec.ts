import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { NimbleRichTextViewerModule } from '../nimble-rich-text-viewer.module';
import { NimbleRichTextViewerDirective } from '../nimble-rich-text-viewer.directive';

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
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRichTextViewerDirective;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRichTextViewerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
        });

        it('has expected defaults for markdownValue', () => {
            expect(directive.markdownValue).toBe('');
        });

        it('has expected defaults for fitToContent', () => {
            expect(directive.fitToContent).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-rich-text-viewer #viewer
                    markdownValue="Markdown value"
                    fit-to-content>
                </nimble-rich-text-viewer>`
        })
        class TestHostComponent {
            @ViewChild('viewer', { read: NimbleRichTextViewerDirective }) public directive: NimbleRichTextViewerDirective;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRichTextViewerDirective;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRichTextViewerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
        });

        it('will use template string values for markdownValue', () => {
            expect(directive.markdownValue).toBe('Markdown value');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-rich-text-viewer #viewer
                    [markdownValue]="markdownValue"
                    [fit-to-content]="fitToContent">
                </nimble-rich-text-viewer>`
        })
        class TestHostComponent {
            @ViewChild('viewer', { read: NimbleRichTextViewerDirective }) public directive: NimbleRichTextViewerDirective;
            public markdownValue = 'Markdown value';
            public fitToContent = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRichTextViewerDirective;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRichTextViewerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
        });

        it('can be configured with property binding for markdownValue', () => {
            expect(directive.markdownValue).toBe('Markdown value');

            fixture.componentInstance.markdownValue = 'new markdown value';
            fixture.detectChanges();

            expect(directive.markdownValue).toBe('new markdown value');
        });
    });
});