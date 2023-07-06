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
            expect(directive.markdownValue).toBeUndefined();
        });

        it('has expected defaults for fitToContent', () => {
            expect(directive.fitToContent).toBeUndefined();
        });
    });
});