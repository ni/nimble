import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabelProviderRichText, NimbleLabelProviderRichTextDirective } from '../nimble-label-provider-rich-text.directive';
import { NimbleLabelProviderRichTextModule } from '../nimble-label-provider-rich-text.module';

describe('Nimble Label Provider Rich text', () => {
    const boldLabel = 'Bold';
    const italicsLabel = 'Italics';
    const numberedListLabel = 'Numbered List';
    const bulletedListLabel = 'Bulleted List';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleLabelProviderRichTextModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-label-provider-rich-text')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-label-provider-rich-text #labelProvider></nimble-label-provider-rich-text>
            `
        })
        class TestHostComponent {
            @ViewChild('labelProvider', { read: NimbleLabelProviderRichTextDirective }) public directive: NimbleLabelProviderRichTextDirective;
            @ViewChild('labelProvider', { read: ElementRef }) public elementRef: ElementRef<LabelProviderRichText>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleLabelProviderRichTextDirective;
        let nativeElement: LabelProviderRichText;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleLabelProviderRichTextModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for toggleBold', () => {
            expect(directive.toggleBold).toBeUndefined();
            expect(nativeElement.toggleBold).toBeUndefined();
        });

        it('has expected defaults for toggleItalics', () => {
            expect(directive.toggleItalics).toBeUndefined();
            expect(nativeElement.toggleItalics).toBeUndefined();
        });

        it('has expected defaults for toggleBulletedList', () => {
            expect(directive.toggleBulletedList).toBeUndefined();
            expect(nativeElement.toggleBulletedList).toBeUndefined();
        });

        it('has expected defaults for toggleNumberedList', () => {
            expect(directive.toggleNumberedList).toBeUndefined();
            expect(nativeElement.toggleNumberedList).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-label-provider-rich-text #labelProvider
                    toggle-bold="${boldLabel}"
                    toggle-italics="${italicsLabel}"
                    toggle-bulleted-list="${bulletedListLabel}"
                    toggle-numbered-list="${numberedListLabel}"
                    >
                </nimble-label-provider-rich-text>
            `
        })
        class TestHostComponent {
            @ViewChild('labelProvider', { read: NimbleLabelProviderRichTextDirective }) public directive: NimbleLabelProviderRichTextDirective;
            @ViewChild('labelProvider', { read: ElementRef }) public elementRef: ElementRef<LabelProviderRichText>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleLabelProviderRichTextDirective;
        let nativeElement: LabelProviderRichText;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleLabelProviderRichTextModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for toggleBold', () => {
            expect(directive.toggleBold).toBe(boldLabel);
            expect(nativeElement.toggleBold).toBe(boldLabel);
        });

        it('will use template string values for toggleItalics', () => {
            expect(directive.toggleItalics).toBe(italicsLabel);
            expect(nativeElement.toggleItalics).toBe(italicsLabel);
        });

        it('will use template string values for toggleBulletedList', () => {
            expect(directive.toggleBulletedList).toBe(bulletedListLabel);
            expect(nativeElement.toggleBulletedList).toBe(bulletedListLabel);
        });

        it('will use template string values for toggleNumberedList', () => {
            expect(directive.toggleNumberedList).toBe(numberedListLabel);
            expect(nativeElement.toggleNumberedList).toBe(numberedListLabel);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-label-provider-rich-text #labelProvider
                    [toggleBold]="toggleBold"
                    [toggleItalics]="toggleItalics"
                    [toggleBulletedList]="toggleBulletedList"
                    [toggleNumberedList]="toggleNumberedList"
                    >
                </nimble-label-provider-rich-text>
            `
        })
        class TestHostComponent {
            @ViewChild('labelProvider', { read: NimbleLabelProviderRichTextDirective }) public directive: NimbleLabelProviderRichTextDirective;
            @ViewChild('labelProvider', { read: ElementRef }) public elementRef: ElementRef<LabelProviderRichText>;
            public toggleBold = boldLabel;
            public toggleItalics = italicsLabel;
            public toggleBulletedList = bulletedListLabel;
            public toggleNumberedList = numberedListLabel;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleLabelProviderRichTextDirective;
        let nativeElement: LabelProviderRichText;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleLabelProviderRichTextModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for toggleBold', () => {
            expect(directive.toggleBold).toBe(boldLabel);
            expect(nativeElement.toggleBold).toBe(boldLabel);

            fixture.componentInstance.toggleBold = 'newBoldLabel';
            fixture.detectChanges();

            expect(directive.toggleBold).toBe('newBoldLabel');
            expect(nativeElement.toggleBold).toBe('newBoldLabel');
        });

        it('can be configured with property binding for toggleItalics', () => {
            expect(directive.toggleItalics).toBe(italicsLabel);
            expect(nativeElement.toggleItalics).toBe(italicsLabel);

            fixture.componentInstance.toggleItalics = 'newItalicsLabel';
            fixture.detectChanges();

            expect(directive.toggleItalics).toBe('newItalicsLabel');
            expect(nativeElement.toggleItalics).toBe('newItalicsLabel');
        });

        it('can be configured with property binding for toggleBulletedList', () => {
            expect(directive.toggleBulletedList).toBe(bulletedListLabel);
            expect(nativeElement.toggleBulletedList).toBe(bulletedListLabel);

            fixture.componentInstance.toggleBulletedList = 'newBulletedListLabel';
            fixture.detectChanges();

            expect(directive.toggleBulletedList).toBe('newBulletedListLabel');
            expect(nativeElement.toggleBulletedList).toBe('newBulletedListLabel');
        });

        it('can be configured with property binding for toggleNumberedList', () => {
            expect(directive.toggleNumberedList).toBe(numberedListLabel);
            expect(nativeElement.toggleNumberedList).toBe(numberedListLabel);

            fixture.componentInstance.toggleNumberedList = 'newNumberedListLabel';
            fixture.detectChanges();

            expect(directive.toggleNumberedList).toBe('newNumberedListLabel');
            expect(nativeElement.toggleNumberedList).toBe('newNumberedListLabel');
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-label-provider-rich-text #labelProvider
                    [attr.toggle-bold]="toggleBold"
                    [attr.toggle-italics]="toggleItalics"
                    [attr.toggle-bulleted-list]="toggleBulletedList"
                    [attr.toggle-numbered-list]="toggleNumberedList"
                    >
                </nimble-label-provider-rich-text>
            `
        })
        class TestHostComponent {
            @ViewChild('labelProvider', { read: NimbleLabelProviderRichTextDirective }) public directive: NimbleLabelProviderRichTextDirective;
            @ViewChild('labelProvider', { read: ElementRef }) public elementRef: ElementRef<LabelProviderRichText>;
            public toggleBold = boldLabel;
            public toggleItalics = italicsLabel;
            public toggleBulletedList = bulletedListLabel;
            public toggleNumberedList = numberedListLabel;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleLabelProviderRichTextDirective;
        let nativeElement: LabelProviderRichText;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleLabelProviderRichTextModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for toggleBold', () => {
            expect(directive.toggleBold).toBe(boldLabel);
            expect(nativeElement.toggleBold).toBe(boldLabel);

            fixture.componentInstance.toggleBold = 'newBoldLabel';
            fixture.detectChanges();

            expect(directive.toggleBold).toBe('newBoldLabel');
            expect(nativeElement.toggleBold).toBe('newBoldLabel');
        });

        it('can be configured with attribute binding for toggleItalics', () => {
            expect(directive.toggleItalics).toBe(italicsLabel);
            expect(nativeElement.toggleItalics).toBe(italicsLabel);

            fixture.componentInstance.toggleItalics = 'newItalicsLabel';
            fixture.detectChanges();

            expect(directive.toggleItalics).toBe('newItalicsLabel');
            expect(nativeElement.toggleItalics).toBe('newItalicsLabel');
        });

        it('can be configured with attribute binding for toggleBulletedList', () => {
            expect(directive.toggleBulletedList).toBe(bulletedListLabel);
            expect(nativeElement.toggleBulletedList).toBe(bulletedListLabel);

            fixture.componentInstance.toggleBulletedList = 'newBulletedListLabel';
            fixture.detectChanges();

            expect(directive.toggleBulletedList).toBe('newBulletedListLabel');
            expect(nativeElement.toggleBulletedList).toBe('newBulletedListLabel');
        });

        it('can be configured with attribute binding for toggleNumberedList', () => {
            expect(directive.toggleNumberedList).toBe(numberedListLabel);
            expect(nativeElement.toggleNumberedList).toBe(numberedListLabel);

            fixture.componentInstance.toggleNumberedList = 'newNumberedListLabel';
            fixture.detectChanges();

            expect(directive.toggleNumberedList).toBe('newNumberedListLabel');
            expect(nativeElement.toggleNumberedList).toBe('newNumberedListLabel');
        });
    });
});
