import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SprightChatConversationModule } from '../spright-chat-conversation.module';
import { SprightChatConversationDirective, type ChatConversation } from '../spright-chat-conversation.directive';

describe('Spright chat conversation', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SprightChatConversationModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('spright-chat-conversation')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <spright-chat-conversation #chatConversation></spright-chat-conversation>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('chatConversation', { read: SprightChatConversationDirective }) public directive: SprightChatConversationDirective;
            @ViewChild('chatConversation', { read: ElementRef }) public elementRef: ElementRef<ChatConversation>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightChatConversationDirective;
        let nativeElement: ChatConversation;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightChatConversationModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for autoScroll', () => {
            expect(directive.autoScroll).toBeFalse();
            expect(nativeElement.autoScroll).toBeFalse();
        });

        it('can use the directive to set autoScroll', () => {
            directive.autoScroll = true;
            expect(nativeElement.autoScroll).toBeTrue();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <spright-chat-conversation #chatConversation
                    auto-scroll
                >
                </spright-chat-conversation>`,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('chatConversation', { read: SprightChatConversationDirective }) public directive: SprightChatConversationDirective;
            @ViewChild('chatConversation', { read: ElementRef }) public elementRef: ElementRef<ChatConversation>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightChatConversationDirective;
        let nativeElement: ChatConversation;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightChatConversationModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for autoScroll', () => {
            expect(directive.autoScroll).toBeTrue();
            expect(nativeElement.autoScroll).toBeTrue();
        });
    });
});
