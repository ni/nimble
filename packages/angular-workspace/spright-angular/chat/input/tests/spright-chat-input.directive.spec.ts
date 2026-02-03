import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SprightChatInputDirective, type ChatInput } from '../spright-chat-input.directive';
import { SprightChatInputModule } from '../spright-chat-input.module';

describe('Spright chat input', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SprightChatInputModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('spright-chat-input')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <spright-chat-input #chatInput></spright-chat-input>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('chatInput', { read: SprightChatInputDirective }) public directive: SprightChatInputDirective;
            @ViewChild('chatInput', { read: ElementRef }) public elementRef: ElementRef<ChatInput>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightChatInputDirective;
        let nativeElement: ChatInput;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightChatInputModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for placeholder', () => {
            expect(directive.placeholder).toBeUndefined();
            expect(nativeElement.placeholder).toBeUndefined();
        });

        it('has expected defaults for sendButtonLabel', () => {
            expect(directive.sendButtonLabel).toBeUndefined();
            expect(nativeElement.sendButtonLabel).toBeUndefined();
        });

        it('has expected defaults for value', () => {
            expect(directive.value).toEqual('');
            expect(nativeElement.value).toEqual('');
        });

        it('has expected defaults for maxlength', () => {
            expect(directive.maxlength).toBe(-1);
            expect(nativeElement.maxlength).toBe(-1);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <spright-chat-input #chatInput
                    placeholder="Placeholder value"
                    send-button-label="Send button label value"
                    value="Value value"
                    maxlength="10"
                    >
                </spright-chat-input>`,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('chatInput', { read: SprightChatInputDirective }) public directive: SprightChatInputDirective;
            @ViewChild('chatInput', { read: ElementRef }) public elementRef: ElementRef<ChatInput>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightChatInputDirective;
        let nativeElement: ChatInput;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightChatInputModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for placeholder', () => {
            expect(directive.placeholder).toBe('Placeholder value');
            expect(nativeElement.placeholder).toBe('Placeholder value');
        });

        it('will use template string values for sendButtonLabel', () => {
            expect(directive.sendButtonLabel).toBe('Send button label value');
            expect(nativeElement.sendButtonLabel).toBe('Send button label value');
        });

        it('will use template string values for value', () => {
            expect(directive.value).toBe('Value value');
            expect(nativeElement.value).toBe('Value value');
        });

        it('will use template string values for maxlength', () => {
            expect(directive.maxlength).toBe(10);
            expect(nativeElement.maxlength).toBe(10);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <spright-chat-input #chatInput
                    [placeholder]="placeholder"
                    [sendButtonLabel]="sendButtonLabel"
                    [value]="value"
                    [maxlength]="maxlength"
                    >
                </spright-chat-input>`,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('chatInput', { read: SprightChatInputDirective }) public directive: SprightChatInputDirective;
            @ViewChild('chatInput', { read: ElementRef }) public elementRef: ElementRef<ChatInput>;
            public placeholder = 'initial';
            public sendButtonLabel = 'initial';
            public value = 'initial';
            public maxlength = 20;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightChatInputDirective;
        let nativeElement: ChatInput;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightChatInputModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
            fixture.detectChanges();
        });

        it('can be configured with property binding for placeholder', () => {
            expect(directive.placeholder).toBe('initial');
            expect(nativeElement.placeholder).toBe('initial');

            fixture.componentInstance.placeholder = 'updated placeholder value';
            fixture.detectChanges();

            expect(directive.placeholder).toBe('updated placeholder value');
            expect(nativeElement.placeholder).toBe('updated placeholder value');
        });

        it('can be configured with property binding for sendButtonLabel', () => {
            expect(directive.sendButtonLabel).toBe('initial');
            expect(nativeElement.sendButtonLabel).toBe('initial');

            fixture.componentInstance.sendButtonLabel = 'updated sendButtonLabel value';
            fixture.detectChanges();

            expect(directive.sendButtonLabel).toBe('updated sendButtonLabel value');
            expect(nativeElement.sendButtonLabel).toBe('updated sendButtonLabel value');
        });

        it('can be configured with property binding for value', () => {
            expect(directive.value).toBe('initial');
            expect(nativeElement.value).toBe('initial');

            fixture.componentInstance.value = 'updated value value';
            fixture.detectChanges();

            expect(directive.value).toBe('updated value value');
            expect(nativeElement.value).toBe('updated value value');
        });

        it('can be configured with property binding for maxlength', () => {
            expect(directive.maxlength).toBe(20);
            expect(nativeElement.maxlength).toBe(20);

            fixture.componentInstance.maxlength = 10;
            fixture.detectChanges();

            expect(directive.maxlength).toBe(10);
            expect(nativeElement.maxlength).toBe(10);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <spright-chat-input #chatInput
                    [attr.error-text]="errorText"
                    [attr.placeholder]="placeholder"
                    [attr.send-button-label]="sendButtonLabel"
                    [attr.value]="value"
                    [attr.maxlength]="maxlength"
                    >
                </spright-chat-input>`,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('chatInput', { read: SprightChatInputDirective }) public directive: SprightChatInputDirective;
            @ViewChild('chatInput', { read: ElementRef }) public elementRef: ElementRef<ChatInput>;
            public placeholder = 'initial';
            public sendButtonLabel = 'initial';
            public value = 'initial';
            public maxlength = 20;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightChatInputDirective;
        let nativeElement: ChatInput;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightChatInputModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for placeholder', () => {
            expect(directive.placeholder).toBe('initial');
            expect(nativeElement.placeholder).toBe('initial');

            fixture.componentInstance.placeholder = 'updated placeholder value';
            fixture.detectChanges();

            expect(directive.placeholder).toBe('updated placeholder value');
            expect(nativeElement.placeholder).toBe('updated placeholder value');
        });

        it('can be configured with attribute binding for sendButtonLabel', () => {
            expect(directive.sendButtonLabel).toBe('initial');
            expect(nativeElement.sendButtonLabel).toBe('initial');

            fixture.componentInstance.sendButtonLabel = 'updated sendButtonLabel value';
            fixture.detectChanges();

            expect(directive.sendButtonLabel).toBe('updated sendButtonLabel value');
            expect(nativeElement.sendButtonLabel).toBe('updated sendButtonLabel value');
        });

        it('can be configured with attribute binding for value', () => {
            expect(directive.value).toBe('initial');
            expect(nativeElement.value).toBe('initial');

            fixture.componentInstance.value = 'updated value value';
            fixture.detectChanges();

            expect(directive.value).toBe('updated value value');
            expect(nativeElement.value).toBe('updated value value');
        });

        it('can be configured with attribute binding for maxlength', () => {
            expect(directive.maxlength).toBe(20);
            expect(nativeElement.maxlength).toBe(20);

            fixture.componentInstance.maxlength = 10;
            fixture.detectChanges();

            expect(directive.maxlength).toBe(10);
            expect(nativeElement.maxlength).toBe(10);
        });
    });
});
