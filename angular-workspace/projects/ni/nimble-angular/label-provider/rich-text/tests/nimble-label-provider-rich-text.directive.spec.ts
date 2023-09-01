import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabelProviderRichText, NimbleLabelProviderRichTextDirective } from '../nimble-label-provider-rich-text.directive';
import { NimbleLabelProviderRichTextModule } from '../nimble-label-provider-rich-text.module';

describe('Nimble Label Provider Rich text', () => {
    const label1 = 'String 1';
    const label2 = 'String 2';
    const label3 = 'String 3';
    const label4 = 'String 4';

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
                    toggle-bold="${label1}"
                    toggle-italics="${label2}"
                    toggle-bulleted-list="${label3}"
                    toggle-numbered-list="${label4}"
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
            expect(directive.toggleBold).toBe(label1);
            expect(nativeElement.toggleBold).toBe(label1);
        });

        it('will use template string values for toggleItalics', () => {
            expect(directive.toggleItalics).toBe(label2);
            expect(nativeElement.toggleItalics).toBe(label2);
        });

        it('will use template string values for toggleBulletedList', () => {
            expect(directive.toggleBulletedList).toBe(label3);
            expect(nativeElement.toggleBulletedList).toBe(label3);
        });

        it('will use template string values for toggleNumberedList', () => {
            expect(directive.toggleNumberedList).toBe(label4);
            expect(nativeElement.toggleNumberedList).toBe(label4);
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
            public toggleBold = label1;
            public toggleItalics = label1;
            public toggleBulletedList = label1;
            public toggleNumberedList = label1;
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
            expect(directive.toggleBold).toBe(label1);
            expect(nativeElement.toggleBold).toBe(label1);

            fixture.componentInstance.toggleBold = label2;
            fixture.detectChanges();

            expect(directive.toggleBold).toBe(label2);
            expect(nativeElement.toggleBold).toBe(label2);
        });

        it('can be configured with property binding for toggleItalics', () => {
            expect(directive.toggleItalics).toBe(label1);
            expect(nativeElement.toggleItalics).toBe(label1);

            fixture.componentInstance.toggleItalics = label2;
            fixture.detectChanges();

            expect(directive.toggleItalics).toBe(label2);
            expect(nativeElement.toggleItalics).toBe(label2);
        });

        it('can be configured with property binding for toggleBulletedList', () => {
            expect(directive.toggleBulletedList).toBe(label1);
            expect(nativeElement.toggleBulletedList).toBe(label1);

            fixture.componentInstance.toggleBulletedList = label2;
            fixture.detectChanges();

            expect(directive.toggleBulletedList).toBe(label2);
            expect(nativeElement.toggleBulletedList).toBe(label2);
        });

        it('can be configured with property binding for toggleNumberedList', () => {
            expect(directive.toggleNumberedList).toBe(label1);
            expect(nativeElement.toggleNumberedList).toBe(label1);

            fixture.componentInstance.toggleNumberedList = label2;
            fixture.detectChanges();

            expect(directive.toggleNumberedList).toBe(label2);
            expect(nativeElement.toggleNumberedList).toBe(label2);
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
            public toggleBold = label1;
            public toggleItalics = label1;
            public toggleBulletedList = label1;
            public toggleNumberedList = label1;
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
            expect(directive.toggleBold).toBe(label1);
            expect(nativeElement.toggleBold).toBe(label1);

            fixture.componentInstance.toggleBold = label2;
            fixture.detectChanges();

            expect(directive.toggleBold).toBe(label2);
            expect(nativeElement.toggleBold).toBe(label2);
        });

        it('can be configured with attribute binding for toggleItalics', () => {
            expect(directive.toggleItalics).toBe(label1);
            expect(nativeElement.toggleItalics).toBe(label1);

            fixture.componentInstance.toggleItalics = label2;
            fixture.detectChanges();

            expect(directive.toggleItalics).toBe(label2);
            expect(nativeElement.toggleItalics).toBe(label2);
        });

        it('can be configured with attribute binding for toggleBulletedList', () => {
            expect(directive.toggleBulletedList).toBe(label1);
            expect(nativeElement.toggleBulletedList).toBe(label1);

            fixture.componentInstance.toggleBulletedList = label2;
            fixture.detectChanges();

            expect(directive.toggleBulletedList).toBe(label2);
            expect(nativeElement.toggleBulletedList).toBe(label2);
        });

        it('can be configured with attribute binding for toggleNumberedList', () => {
            expect(directive.toggleNumberedList).toBe(label1);
            expect(nativeElement.toggleNumberedList).toBe(label1);

            fixture.componentInstance.toggleNumberedList = label2;
            fixture.detectChanges();

            expect(directive.toggleNumberedList).toBe(label2);
            expect(nativeElement.toggleNumberedList).toBe(label2);
        });
    });
});
