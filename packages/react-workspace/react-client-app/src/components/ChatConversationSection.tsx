import { useState, useRef, useEffect } from 'react';
import { NimbleAnchor } from '@ni/nimble-react/anchor';
import { NimbleButton } from '@ni/nimble-react/button';
import { NimbleBanner } from '@ni/nimble-react/banner';
import { NimbleSpinner } from '@ni/nimble-react/spinner';
import { NimbleToolbar } from '@ni/nimble-react/toolbar';
import { NimbleIconCopyText } from '@ni/nimble-react/icons/copy-text';
import { NimbleIconWebviCustom } from '@ni/nimble-react/icons/webvi-custom';
import { NimbleIconMessagesSparkle } from '@ni/nimble-react/icons/messages-sparkle';
import { NimbleIconPencilToRectangle } from '@ni/nimble-react/icons/pencil-to-rectangle';
import { SprightChatConversation } from '@ni/spright-react/chat/conversation';
import { SprightChatInput } from '@ni/spright-react/chat/input';
import { SprightChatMessageInbound } from '@ni/spright-react/chat/message/inbound';
import { SprightChatMessageOutbound } from '@ni/spright-react/chat/message/outbound';
import { SprightChatMessageSystem } from '@ni/spright-react/chat/message/system';
import { SubContainer } from './SubContainer';

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

export function ChatConversationSection(): React.JSX.Element {
    const [messages, setMessages] = useState<ChatEntry[]>([]);
    const streamingIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

    useEffect((): (() => void) => {
        return () => {
            if (streamingIntervalRef.current !== undefined) {
                clearInterval(streamingIntervalRef.current);
            }
        };
    }, []);

    function onChatInputSend(event: CustomEvent<{ text: string }>): void {
        const text = event.detail.text;
        const command = text.trim().toLowerCase();
        if (command === 'stop') {
            if (streamingIntervalRef.current !== undefined) {
                clearInterval(streamingIntervalRef.current);
                streamingIntervalRef.current = undefined;
            }
            return;
        }
        if (command !== 'start') {
            // Post the user's message as a new outbound message.
            setMessages(prevMessages => [...prevMessages, { type: 'user', text }]);
        }
        if (command === 'start') {
            if (streamingIntervalRef.current !== undefined) {
                return;
            }
            // Add the incoming response that streams text.
            setMessages(prevMessages => [...prevMessages, { type: 'advisor', text: '' }]);
            let wordIndex = 0;
            streamingIntervalRef.current = setInterval(() => {
                const chunkText = streamingWords[wordIndex % streamingWords.length] ?? '';
                wordIndex += 1;
                setMessages(prevMessages => {
                    const advisorMessageIndex = prevMessages.map(m => m.type).lastIndexOf('advisor');
                    if (advisorMessageIndex === -1) {
                        return prevMessages;
                    }
                    const newMessages = [...prevMessages];
                    const currentMessage = newMessages[advisorMessageIndex];
                    newMessages[advisorMessageIndex] = {
                        ...currentMessage,
                        text: currentMessage.text ? `${currentMessage.text} ${chunkText}` : chunkText
                    };
                    return newMessages;
                });
            }, 150);
        }
    }

    return (
        <SubContainer label="Chat Conversation and Messages (Spright)">
            <SprightChatConversation autoScroll style={{ width: '700px', height: '650px' }}>
                <NimbleToolbar slot="toolbar">
                    <NimbleIconMessagesSparkle slot="start"></NimbleIconMessagesSparkle>
                    <span style={{ marginLeft: '8px' }}>AI Assistant</span>
                    <NimbleButton appearance="ghost" contentHidden title="Create new chat" slot="end">
                        Create new chat
                        <NimbleIconPencilToRectangle slot="start"></NimbleIconPencilToRectangle>
                    </NimbleButton>
                </NimbleToolbar>
                <NimbleBanner slot="start" open severity="information">
                    <span slot="title">Title of the banner</span>
                    This is the message text of this banner. It tells you something interesting.
                </NimbleBanner>
                <SprightChatMessageSystem>To start, press any key.</SprightChatMessageSystem>
                <SprightChatMessageOutbound>Where is the Any key?</SprightChatMessageOutbound>
                <SprightChatMessageSystem>
                    <NimbleSpinner appearance="accent"></NimbleSpinner>
                </SprightChatMessageSystem>
                <SprightChatMessageInbound>
                    <NimbleButton slot="footer-actions" appearance='ghost' contentHidden>
                        <NimbleIconCopyText slot="start"></NimbleIconCopyText>
                        Copy
                    </NimbleButton>
                    <NimbleIconWebviCustom style={{ height: '100px', width: '100px' }}></NimbleIconWebviCustom>
                    <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                    <NimbleButton slot="end" appearance="block">Order a tab</NimbleButton>
                    <NimbleButton slot="end" appearance="block">Check core temperature</NimbleButton>
                </SprightChatMessageInbound>
                {messages.map((entry, index) => {
                    if (entry.type === 'user') {
                        return (
                            <SprightChatMessageOutbound key={index}>
                                <span style={{ whiteSpace: 'pre-wrap' }}>{entry.text}</span>
                            </SprightChatMessageOutbound>
                        );
                    }
                    return (
                        <SprightChatMessageInbound key={index}>
                            <span style={{ whiteSpace: 'pre-wrap' }}>{entry.text}</span>
                        </SprightChatMessageInbound>
                    );
                })}
                <SprightChatInput
                    slot="input"
                    placeholder={'Type a message (try "start" or "stop")'}
                    sendButtonLabel="Send"
                    onSend={onChatInputSend}
                ></SprightChatInput>
                <span slot="end">
                    AI-generated content may be incorrect.
                    <NimbleAnchor href="https://www.ni.com" target="_blank">View Terms and Conditions</NimbleAnchor>
                </span>
            </SprightChatConversation>
        </SubContainer>
    );
}
