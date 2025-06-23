import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SprightChatMessageModule } from '../spright-chat-message.module';
import { ChatMessageType, SprightChatMessageDirective, type ChatMessage } from '../spright-chat-message.directive';

describe('Spright chat message', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SprightChatMessageModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('spright-chat-message')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <spright-chat-message #message>Content</spright-chat-message>
            `
        })
        class TestHostComponent {
            @ViewChild('message', { read: SprightChatMessageDirective }) public directive: SprightChatMessageDirective;
            @ViewChild('message', { read: ElementRef }) public elementRef: ElementRef<ChatMessage>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightChatMessageDirective;
        let nativeElement: ChatMessage;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightChatMessageModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for messageType', () => {
            expect(directive.messageType).toBe(ChatMessageType.system);
            expect(nativeElement.messageType).toBe(ChatMessageType.system);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <spright-chat-message #message
                    message-type="inbound">
                    Content
                </spright-chat-message>`
        })
        class TestHostComponent {
            @ViewChild('message', { read: SprightChatMessageDirective }) public directive: SprightChatMessageDirective;
            @ViewChild('message', { read: ElementRef }) public elementRef: ElementRef<ChatMessage>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightChatMessageDirective;
        let nativeElement: ChatMessage;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightChatMessageModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for messageType', () => {
            expect(directive.messageType).toBe(ChatMessageType.inbound);
            expect(nativeElement.messageType).toBe(ChatMessageType.inbound);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <spright-chat-message #message
                    [messageType]="messageType">
                    Content
                </spright-chat-message>`
        })
        class TestHostComponent {
            @ViewChild('message', { read: SprightChatMessageDirective }) public directive: SprightChatMessageDirective;
            @ViewChild('message', { read: ElementRef }) public elementRef: ElementRef<ChatMessage>;
            public messageType: ChatMessageType = ChatMessageType.inbound;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightChatMessageDirective;
        let nativeElement: ChatMessage;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightChatMessageModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for messageType', () => {
            expect(directive.messageType).toBe(ChatMessageType.inbound);
            expect(nativeElement.messageType).toBe(ChatMessageType.inbound);

            fixture.componentInstance.messageType = ChatMessageType.outbound;
            fixture.detectChanges();

            expect(directive.messageType).toBe(ChatMessageType.outbound);
            expect(nativeElement.messageType).toBe(ChatMessageType.outbound);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <spright-chat-message #message
                    [attr.message-type]="messageType">
                    Content
                </spright-chat-message>`
        })
        class TestHostComponent {
            @ViewChild('message', { read: SprightChatMessageDirective }) public directive: SprightChatMessageDirective;
            @ViewChild('message', { read: ElementRef }) public elementRef: ElementRef<ChatMessage>;
            public messageType: ChatMessageType = ChatMessageType.inbound;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightChatMessageDirective;
        let nativeElement: ChatMessage;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightChatMessageModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for message-type', () => {
            expect(directive.messageType).toBe(ChatMessageType.inbound);
            expect(nativeElement.messageType).toBe(ChatMessageType.inbound);

            fixture.componentInstance.messageType = ChatMessageType.outbound;
            fixture.detectChanges();

            expect(directive.messageType).toBe(ChatMessageType.outbound);
            expect(nativeElement.messageType).toBe(ChatMessageType.outbound);
        });
    });
});
