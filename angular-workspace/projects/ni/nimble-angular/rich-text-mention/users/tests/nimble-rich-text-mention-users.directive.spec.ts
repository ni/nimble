import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleRichTextMentionUsersModule } from '../nimble-rich-text-mention-users.module';
import { NimbleRichTextEditorModule } from '../../../rich-text/editor/nimble-rich-text-editor.module';
import { NimbleRichTextMentionUsersDirective, RichTextMentionUsers } from '../nimble-rich-text-mention-users.directive';

describe('NimbleRichTextMentionUsers', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleRichTextMentionUsersModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-rich-text-mention-users')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-rich-text-editor>
                    <nimble-rich-text-mention-users #users></nimble-rich-text-mention-users>
                </nimble-rich-text-editor>
            `
        })
        class TestHostComponent {
            @ViewChild('users', { read: NimbleRichTextMentionUsersDirective }) public directive: NimbleRichTextMentionUsersDirective;
            @ViewChild('users', { read: ElementRef }) public elementRef: ElementRef<RichTextMentionUsers>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRichTextMentionUsersDirective;
        let nativeElement: RichTextMentionUsers;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRichTextMentionUsersModule, NimbleRichTextEditorModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected default for pattern', () => {
            expect(directive.pattern).toBeUndefined();
            expect(nativeElement.pattern).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-rich-text-editor>
                    <nimble-rich-text-mention-users pattern="^user:(.*)" #users></nimble-rich-text-mention-users>
                </nimble-rich-text-editor>
            `
        })
        class TestHostComponent {
            @ViewChild('users', { read: NimbleRichTextMentionUsersDirective }) public directive: NimbleRichTextMentionUsersDirective;
            @ViewChild('users', { read: ElementRef }) public elementRef: ElementRef<RichTextMentionUsers>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRichTextMentionUsersDirective;
        let nativeElement: RichTextMentionUsers;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRichTextMentionUsersModule, NimbleRichTextEditorModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for pattern', () => {
            expect(directive.pattern).toBe('^user:(.*)');
            expect(nativeElement.pattern).toBe('^user:(.*)');
        });

        it('has valid configuration by default', () => {
            expect(directive.checkValidity()).toBeTrue();
            expect(nativeElement.checkValidity()).toBeTrue();
        });

        it('has empty mentioned Hrefs array by default', () => {
            expect(directive.getMentionedHrefs()).toEqual([]);
            expect(nativeElement.getMentionedHrefs()).toEqual([]);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-rich-text-editor>
                    <nimble-rich-text-mention-users [pattern]="pattern" #users></nimble-rich-text-mention-users>
                </nimble-rich-text-editor>
            `
        })
        class TestHostComponent {
            @ViewChild('users', { read: NimbleRichTextMentionUsersDirective }) public directive: NimbleRichTextMentionUsersDirective;
            @ViewChild('users', { read: ElementRef }) public elementRef: ElementRef<RichTextMentionUsers>;
            public pattern = '^user:(.*)';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRichTextMentionUsersDirective;
        let nativeElement: RichTextMentionUsers;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRichTextMentionUsersModule, NimbleRichTextEditorModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for pattern', () => {
            expect(directive.pattern).toBe('^user:(.*)');
            expect(nativeElement.pattern).toBe('^user:(.*)');

            fixture.componentInstance.pattern = '^https://user/(.*)';
            fixture.detectChanges();

            expect(directive.pattern).toBe('^https://user/(.*)');
            expect(nativeElement.pattern).toBe('^https://user/(.*)');
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-rich-text-editor>
                    <nimble-rich-text-mention-users [attr.pattern]="pattern" #users></nimble-rich-text-mention-users>
                </nimble-rich-text-editor>
            `
        })
        class TestHostComponent {
            @ViewChild('users', { read: NimbleRichTextMentionUsersDirective }) public directive: NimbleRichTextMentionUsersDirective;
            @ViewChild('users', { read: ElementRef }) public elementRef: ElementRef<RichTextMentionUsers>;
            public pattern = '^user:(.*)';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRichTextMentionUsersDirective;
        let nativeElement: RichTextMentionUsers;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRichTextMentionUsersModule, NimbleRichTextEditorModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for pattern', () => {
            expect(directive.pattern).toBe('^user:(.*)');
            expect(nativeElement.pattern).toBe('^user:(.*)');

            fixture.componentInstance.pattern = '^https://user/(.*)';
            fixture.detectChanges();

            expect(directive.pattern).toBe('^https://user/(.*)');
            expect(nativeElement.pattern).toBe('^https://user/(.*)');
        });
    });
});
