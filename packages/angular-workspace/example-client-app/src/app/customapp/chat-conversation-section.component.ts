import { Component, type OnDestroy } from '@angular/core';
import type { ChatInputSendEventDetail } from '@ni/spright-angular/chat/input';

interface ChatEntry {
    type: 'user' | 'advisor';
    text: string;
}

const songThatDoesNotEnd = `
This is the song that doesn't end
Yes, it goes on and on, my friend
Some people started singing it not knowing what it was,
And they’ll continue singing it forever just because`;

const streamingWords = songThatDoesNotEnd.split(' ');

@Component({
    selector: 'example-chat-conversation-section',
    template: `
        <example-sub-container label="Chat Conversation and Messages (Spright)">
            <spright-chat-conversation auto-scroll>
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
                @for (entry of messages; track entry) {
                    @if (entry.type === 'user') {
                        <spright-chat-message-outbound><span>{{entry.text}}</span></spright-chat-message-outbound>
                    }
                    @if (entry.type === 'advisor') {
                        <spright-chat-message-inbound><span>{{entry.text}}</span></spright-chat-message-inbound>
                    }
                }
                <spright-chat-input slot="input" placeholder='Type a message (try "start" or "stop")' send-button-label="Send" (send)="onChatInputSend($event)"></spright-chat-input>
                <span slot="end">
                    AI-generated content may be incorrect.
                    <nimble-anchor href="https://www.ni.com" target="_blank">View Terms and Conditions</nimble-anchor>
                </span>
            </spright-chat-conversation>
        </example-sub-container>
    `,
    styles: [`
        spright-chat-conversation {
            width: 700px;
            height: 650px;
        }
        spright-chat-message-outbound span,
        spright-chat-message-inbound span { white-space: pre-wrap; }
    `],
    standalone: false
})
export class ChatConversationSectionComponent implements OnDestroy {
    public messages: ChatEntry[] = [];

    private streamingIntervalId: ReturnType<typeof setInterval> | undefined = undefined;

    public onChatInputSend(e: Event): void {
        const text = (e as CustomEvent<ChatInputSendEventDetail>).detail.text;
        const command = text.trim().toLowerCase();
        if (command === 'stop') {
            if (this.streamingIntervalId !== undefined) {
                clearInterval(this.streamingIntervalId);
                this.streamingIntervalId = undefined;
            }
            return;
        }
        if (command !== 'start') {
            // Post the user's message as a new outbound message.
            this.messages.push({ type: 'user', text });
        }
        if (command === 'start') {
            if (this.streamingIntervalId !== undefined) {
                return;
            }
            // Add the incoming response that streams text.
            const advisorEntry: ChatEntry = { type: 'advisor', text: '' };
            this.messages.push(advisorEntry);
            let wordIndex = 0;
            this.streamingIntervalId = setInterval(() => {
                const chunkText = streamingWords[wordIndex % streamingWords.length] ?? '';
                advisorEntry.text = advisorEntry.text
                    ? `${advisorEntry.text} ${chunkText}`
                    : chunkText;
                wordIndex += 1;
            }, 150);
        }
    }

    public ngOnDestroy(): void {
        if (this.streamingIntervalId !== undefined) {
            clearInterval(this.streamingIntervalId);
        }
    }
}
