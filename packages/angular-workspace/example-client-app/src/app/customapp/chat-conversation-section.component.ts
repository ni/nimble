import { Component, type OnDestroy } from '@angular/core';
import type { ChatInputSendEventDetail } from '@ni/spright-angular/chat/input';

interface ChatEntry {
    type: 'user' | 'advisor' | 'system';
    text: string;
    streaming: boolean;
}

const singleResponse = `To configure your Python version, select Adapters from the Configure menu.
Configure the Python adapter. Choose the desired version from the Version dropdown.
You can also specify a Python version for a specific module call in the Advanced Settings of the Python adapter.
Additionally, you can set environment variables in the adapter configuration to control runtime behavior.
This gives you fine-grained control over which interpreter is used per step in your test sequence.
If you have multiple virtual environments, make sure to point the adapter to the correct executable path.
The path must be absolute and should not contain spaces unless properly quoted.
For further reference, consult the NI TestStand help documentation under the Python Adapter section.`;

const cannedResponseWords = Array(5).fill(singleResponse).join('\n').split(/\s+/);

@Component({
    selector: 'example-chat-conversation-section',
    template: `
        <example-sub-container label="Chat Conversation and Messages (Spright)">
            <div class="conversations">
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
                     @for (message of staticUserMessages; track message) {
                        <spright-chat-message-outbound><span>{{message}}</span></spright-chat-message-outbound>
                    }
                    <spright-chat-input slot="input" placeholder="Type here" (send)="onStaticChatInputSend($event)"></spright-chat-input>
                    <span slot="end">
                        AI-generated content may be incorrect.
                        <nimble-anchor href="https://www.ni.com" target="_blank">View Terms and Conditions</nimble-anchor>
                    </span>
                </spright-chat-conversation>

                <spright-chat-conversation>
                    <nimble-toolbar slot="toolbar">
                        <nimble-icon-messages-sparkle slot="start"></nimble-icon-messages-sparkle>
                        <span class="toolbar-title">AI Assistant (Streaming)</span>
                    </nimble-toolbar>
                    <ng-container *ngFor="let entry of messages">
                        <spright-chat-message-outbound *ngIf="entry.type === 'user'">
                            <span>{{entry.text}}</span>
                        </spright-chat-message-outbound>
                        <spright-chat-message-system *ngIf="entry.type === 'system'">
                            <nimble-spinner appearance="accent"></nimble-spinner>
                        </spright-chat-message-system>
                        <spright-chat-message-inbound *ngIf="entry.type === 'advisor'">
                            <span>{{entry.text}}</span>
                            <nimble-button *ngIf="!entry.streaming" slot="footer-actions" appearance="ghost" content-hidden title="Copy">
                                <nimble-icon-copy-text slot="start"></nimble-icon-copy-text>
                                Copy
                            </nimble-button>
                        </spright-chat-message-inbound>
                    </ng-container>
                    <spright-chat-input slot="input" placeholder="Send a message…" (send)="onChatInputSend($event)" [send-disabled]="isStreaming"></spright-chat-input>
                    <span slot="end">AI-generated content may be incorrect.</span>
                </spright-chat-conversation>
            </div>
        </example-sub-container>
    `,
    styles: [`
        .conversations {
            display: flex;
            gap: 16px;
        }
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
    public staticUserMessages: string[] = [];
    public messages: ChatEntry[] = [];
    public isStreaming = false;

    private streamInterval: ReturnType<typeof setInterval> | null = null;

    public onStaticChatInputSend(e: Event): void {
        this.staticUserMessages.push((e as CustomEvent<ChatInputSendEventDetail>).detail.text);
    }

    public onChatInputSend(e: Event): void {
        const text = (e as CustomEvent<ChatInputSendEventDetail>).detail.text;
        this.messages.push({ type: 'user', text, streaming: false });
        this.startStreaming();
    }

    public ngOnDestroy(): void {
        if (this.streamInterval !== null) {
            clearInterval(this.streamInterval);
        }
    }

    private startStreaming(): void {
        this.isStreaming = true;
        const spinnerEntry: ChatEntry = { type: 'system', text: '', streaming: true };
        this.messages.push(spinnerEntry);

        let wordIndex = 0;
        setTimeout(() => {
            const idx = this.messages.indexOf(spinnerEntry);
            if (idx !== -1) {
                this.messages.splice(idx, 1);
            }
            const advisorEntry: ChatEntry = { type: 'advisor', text: '', streaming: true };
            this.messages.push(advisorEntry);

            this.streamInterval = setInterval(() => {
                if (wordIndex < cannedResponseWords.length) {
                    advisorEntry.text += (wordIndex === 0 ? '' : ' ') + cannedResponseWords[wordIndex];
                    wordIndex += 1;
                } else {
                    clearInterval(this.streamInterval!);
                    this.streamInterval = null;
                    advisorEntry.streaming = false;
                    this.isStreaming = false;
                }
            }, 30);
        }, 300);
    }
}
