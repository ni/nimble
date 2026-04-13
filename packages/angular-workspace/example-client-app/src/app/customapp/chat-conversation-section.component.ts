import { Component } from '@angular/core';
import type { ChatInputSendEventDetail } from '@ni/spright-angular/chat/input';

@Component({
    selector: 'example-chat-conversation-section',
    template: `
        <example-sub-container label="Chat Conversation and Messages (Spright)">
            <spright-chat-conversation>
                <nimble-toolbar slot="toolbar">
                    <nimble-icon-messages-sparkle slot="start"></nimble-icon-messages-sparkle>
                    <span class="toolbar-title">AI Assistant</span>
                    <nimble-button appearance="ghost" content-hidden title="Create new chat" slot="end">
                        Create new chat
                        <nimble-icon-pencil-to-rectangle slot="start"></nimble-icon-pencil-to-rectangle>
                    </nimble-button>
                </nimble-toolbar>
                <nimble-banner slot="start" open severity="information">
                    <span slot="title">Title of the banner</span>
                        This is the message text of this banner. It tells you something interesting.
                </nimble-banner>
                <spright-chat-message-system>To start, press any key.</spright-chat-message-system>
                <spright-chat-message-outbound>Where is the Any key?</spright-chat-message-outbound>
                <spright-chat-message-system>
                    <nimble-spinner appearance="accent"></nimble-spinner>
                </spright-chat-message-system>
                <spright-chat-message-inbound>
                    <nimble-button slot="footer-actions" appearance='ghost' content-hidden>
                        <nimble-icon-copy-text slot="start"></nimble-icon-copy-text>
                        Copy
                    </nimble-button>
                    <nimble-icon-webvi-custom style="height: 100px; width: 100px;"></nimble-icon-webvi-custom>
                    <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                    <nimble-button slot="end" appearance="block">Order a tab</nimble-button>
                    <nimble-button slot="end" appearance="block">Check core temperature</nimble-button>
                </spright-chat-message-inbound>
                <spright-chat-message-outbound *ngFor="let message of chatUserMessages"><span>{{message}}</span></spright-chat-message-outbound>
                <spright-chat-input slot="input" placeholder="Type here" (send)="onChatInputSend($event)"></spright-chat-input>
                <span slot="end">
                    AI-generated content may be incorrect.
                    <nimble-anchor href="https://www.ni.com" target="_blank">View Terms and Conditions</nimble-anchor>
                </span>
            </spright-chat-conversation>
        </example-sub-container>
    `,
    styles: [`
        spright-chat-conversation { max-width: 700px; }
        spright-chat-message span { white-space: pre-wrap; }
    `],
    standalone: false
})
export class ChatConversationSectionComponent {
    public chatUserMessages: string[] = [];

    public onChatInputSend(e: Event): void {
        const chatInputSendEvent = (e as CustomEvent<ChatInputSendEventDetail>);
        this.chatUserMessages.push(chatInputSendEvent.detail.text);
    }
}
