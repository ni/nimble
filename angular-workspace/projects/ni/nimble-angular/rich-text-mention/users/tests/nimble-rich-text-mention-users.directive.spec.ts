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

        it('has expected default for button-label', () => {
            expect(directive.buttonLabel).toBeUndefined();
            expect(nativeElement.buttonLabel).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-rich-text-editor>
                    <nimble-rich-text-mention-users pattern="^user:(.*)" button-label="Mention User" #users></nimble-rich-text-mention-users>
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

        it('will use template string values for button-label', () => {
            expect(directive.buttonLabel).toBe('^user:(.*)');
            expect(nativeElement.buttonLabel).toBe('^user:(.*)');
        });

        it('has valid configuration by default', () => {
            expect(directive.checkValidity()).toBeTrue();
            expect(nativeElement.checkValidity()).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-rich-text-editor>
                    <nimble-rich-text-mention-users [pattern]="pattern" [button-label]="buttonLabel" #users></nimble-rich-text-mention-users>
                </nimble-rich-text-editor>
            `
        })
        class TestHostComponent {
            @ViewChild('users', { read: NimbleRichTextMentionUsersDirective }) public directive: NimbleRichTextMentionUsersDirective;
            @ViewChild('users', { read: ElementRef }) public elementRef: ElementRef<RichTextMentionUsers>;
            public pattern = '^user:(.*)';
            public buttonLabel = 'Mention User';
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

        it('can be configured with property binding for button-label', () => {
            expect(directive.buttonLabel).toBe('Mention User');
            expect(nativeElement.buttonLabel).toBe('Mention User');

            fixture.componentInstance.buttonLabel = 'Mention Issue';
            fixture.detectChanges();

            expect(directive.buttonLabel).toBe('Mention Issue');
            expect(nativeElement.buttonLabel).toBe('Mention Issue');
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-rich-text-editor>
                    <nimble-rich-text-mention-users [attr.pattern]="pattern" [attr.button-label]="buttonLabel" #users></nimble-rich-text-mention-users>
                </nimble-rich-text-editor>
            `
        })
        class TestHostComponent {
            @ViewChild('users', { read: NimbleRichTextMentionUsersDirective }) public directive: NimbleRichTextMentionUsersDirective;
            @ViewChild('users', { read: ElementRef }) public elementRef: ElementRef<RichTextMentionUsers>;
            public pattern = '^user:(.*)';
            public buttonLabel = 'Mention User';
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

        it('can be configured with property binding for button-label', () => {
            expect(directive.buttonLabel).toBe('Mention User');
            expect(nativeElement.buttonLabel).toBe('Mention User');

            fixture.componentInstance.buttonLabel = 'Mention Issue';
            fixture.detectChanges();

            expect(directive.buttonLabel).toBe('Mention Issue');
            expect(nativeElement.buttonLabel).toBe('Mention Issue');
        });
    });
});
