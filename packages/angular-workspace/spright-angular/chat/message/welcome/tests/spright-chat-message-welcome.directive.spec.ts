import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SprightChatMessageWelcomeDirective, type ChatMessageWelcome } from '../spright-chat-message-welcome.directive';
import { SprightChatMessageWelcomeModule } from '../spright-chat-message-welcome.module';

describe('Spright chat message welcome', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SprightChatMessageWelcomeModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('spright-chat-message-welcome')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <spright-chat-message-welcome #message>Content</spright-chat-message-welcome>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('message', { read: SprightChatMessageWelcomeDirective }) public directive: SprightChatMessageWelcomeDirective;
            @ViewChild('message', { read: ElementRef }) public elementRef: ElementRef<ChatMessageWelcome>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightChatMessageWelcomeDirective;
        let nativeElement: ChatMessageWelcome;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightChatMessageWelcomeModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for welcomeTitle', () => {
            expect(directive.welcomeTitle).toBeUndefined();
            expect(nativeElement.welcomeTitle).toBeUndefined();
        });

        it('has expected defaults for subtitle', () => {
            expect(directive.subtitle).toBeUndefined();
            expect(nativeElement.subtitle).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <spright-chat-message-welcome #message welcome-title="Welcome title" subtitle="Welcome subtitle">
                    Content
                </spright-chat-message-welcome>`,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('message', { read: SprightChatMessageWelcomeDirective }) public directive: SprightChatMessageWelcomeDirective;
            @ViewChild('message', { read: ElementRef }) public elementRef: ElementRef<ChatMessageWelcome>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightChatMessageWelcomeDirective;
        let nativeElement: ChatMessageWelcome;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightChatMessageWelcomeModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for welcomeTitle', () => {
            expect(directive.welcomeTitle).toBe('Welcome title');
            expect(nativeElement.welcomeTitle).toBe('Welcome title');
        });

        it('will use template string values for subtitle', () => {
            expect(directive.subtitle).toBe('Welcome subtitle');
            expect(nativeElement.subtitle).toBe('Welcome subtitle');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <spright-chat-message-welcome #message [welcomeTitle]="title" [subtitle]="subtitle">
                    Content
                </spright-chat-message-welcome>`,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('message', { read: SprightChatMessageWelcomeDirective }) public directive: SprightChatMessageWelcomeDirective;
            @ViewChild('message', { read: ElementRef }) public elementRef: ElementRef<ChatMessageWelcome>;
            public title = 'initial title';
            public subtitle = 'initial subtitle';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightChatMessageWelcomeDirective;
        let nativeElement: ChatMessageWelcome;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightChatMessageWelcomeModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for welcomeTitle and subtitle', () => {
            expect(directive.welcomeTitle).toBe('initial title');
            expect(nativeElement.welcomeTitle).toBe('initial title');
            expect(directive.subtitle).toBe('initial subtitle');
            expect(nativeElement.subtitle).toBe('initial subtitle');

            fixture.componentInstance.title = 'updated title';
            fixture.componentInstance.subtitle = 'updated subtitle';
            fixture.detectChanges();

            expect(directive.welcomeTitle).toBe('updated title');
            expect(nativeElement.welcomeTitle).toBe('updated title');
            expect(directive.subtitle).toBe('updated subtitle');
            expect(nativeElement.subtitle).toBe('updated subtitle');
        });
    });
});