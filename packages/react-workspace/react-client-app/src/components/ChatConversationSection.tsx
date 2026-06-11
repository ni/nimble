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

export function ChatConversationSection(): React.JSX.Element {
    const [staticChatUserMessages, setStaticChatUserMessages] = useState<string[]>([]);
    const [messages, setMessages] = useState<ChatEntry[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [customAdvisorText, setCustomAdvisorText] = useState('');
    const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect((): (() => void) => {
        return () => {
            if (streamIntervalRef.current !== null) {
                clearInterval(streamIntervalRef.current);
            }
        };
    }, []);

    function onStaticChatInputSend(event: CustomEvent<{ text: string }>): void {
        const text = event.detail.text;
        setStaticChatUserMessages(prevMessages => [...prevMessages, text]);
    }

    function onChatInputSend(event: CustomEvent<{ text: string }>): void {
        const text = event.detail.text;
        setMessages(prevMessages => [...prevMessages, { type: 'user', text, streaming: false }]);
        startStreaming();
    }

    function startStreaming(): void {
        setIsStreaming(true);
        const spinnerEntry: ChatEntry = { type: 'system', text: '', streaming: true };
        setMessages(prevMessages => [...prevMessages, spinnerEntry]);

        const responseWords = customAdvisorText.trim().length > 0
            ? customAdvisorText.trim().split(/\s+/)
            : cannedResponseWords;
        let wordIndex = 0;

        setTimeout(() => {
            setMessages(prevMessages => {
                const newMessages = prevMessages.filter(m => !(m.type === 'system' && m.streaming));
                return [...newMessages, { type: 'advisor', text: '', streaming: true }];
            });

            streamIntervalRef.current = setInterval(() => {
                setMessages(prevMessages => {
                    const advisorMessageIndex = prevMessages.findIndex(m => m.type === 'advisor' && m.streaming);
                    if (advisorMessageIndex === -1) {
                        return prevMessages;
                    }

                    if (wordIndex < responseWords.length) {
                        const newMessages = [...prevMessages];
                        const currentMessage = newMessages[advisorMessageIndex];
                        newMessages[advisorMessageIndex] = {
                            ...currentMessage,
                            text: currentMessage.text + (wordIndex === 0 ? '' : ' ') + responseWords[wordIndex]
                        };
                        wordIndex += 1;
                        return newMessages;
                    }

                    clearInterval(streamIntervalRef.current ?? 0);
                    streamIntervalRef.current = null;
                    const newMessages = [...prevMessages];
                    newMessages[advisorMessageIndex] = {
                        ...newMessages[advisorMessageIndex],
                        streaming: false
                    };
                    setIsStreaming(false);
                    return newMessages;
                });
            }, 30);
        }, 300);
    }

    return (
        <SubContainer label="Chat Conversation and Messages (Spright)">
            <div style={{ display: 'flex', gap: '16px' }}>
                <SprightChatConversation style={{ width: '700px', height: '650px' }}>
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
                    {staticChatUserMessages.map((message, index) => (
                        <SprightChatMessageOutbound key={index}>
                            <span>{message}</span>
                        </SprightChatMessageOutbound>
                    ))}
                    <SprightChatInput
                        slot="input"
                        placeholder="Type here"
                        onSend={onStaticChatInputSend}
                    ></SprightChatInput>
                    <span slot="end">
                        AI-generated content may be incorrect.
                        <NimbleAnchor href="https://www.ni.com" target="_blank">View Terms and Conditions</NimbleAnchor>
                    </span>
                </SprightChatConversation>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ font: 'var(--ni-nimble-body-font)', color: 'var(--ni-nimble-body-font-color)' }}>
                        Custom advisor response (leave empty for canned):
                    </label>
                    <textarea
                        rows={3}
                        value={customAdvisorText}
                        onChange={e => setCustomAdvisorText(e.target.value)}
                        style={{
                            font: 'var(--ni-nimble-body-font)',
                            color: 'var(--ni-nimble-body-font-color)',
                            background: 'var(--ni-nimble-fill-secondary-color)',
                            border: '1px solid var(--ni-nimble-border-color)',
                            padding: '4px',
                            width: '700px',
                            resize: 'vertical'
                        }}
                    ></textarea>
                    <SprightChatConversation style={{ width: '700px', height: '650px' }} autoScroll>
                        <NimbleToolbar slot="toolbar">
                            <NimbleIconMessagesSparkle slot="start"></NimbleIconMessagesSparkle>
                            <span style={{ marginLeft: '8px' }}>AI Assistant (Streaming)</span>
                        </NimbleToolbar>
                        {messages.map((entry, index) => {
                            if (entry.type === 'user') {
                                return (
                                    <SprightChatMessageOutbound key={index}>
                                        <span style={{ whiteSpace: 'pre-wrap' }}>{entry.text}</span>
                                    </SprightChatMessageOutbound>
                                );
                            }
                            if (entry.type === 'system') {
                                return (
                                    <SprightChatMessageSystem key={index}>
                                        <NimbleSpinner appearance="accent"></NimbleSpinner>
                                    </SprightChatMessageSystem>
                                );
                            }
                            return (
                                <SprightChatMessageInbound key={index}>
                                    <span style={{ whiteSpace: 'pre-wrap' }}>{entry.text}</span>
                                    {!entry.streaming && (
                                        <NimbleButton slot="footer-actions" appearance="ghost" contentHidden title="Copy">
                                            <NimbleIconCopyText slot="start"></NimbleIconCopyText>
                                            Copy
                                        </NimbleButton>
                                    )}
                                </SprightChatMessageInbound>
                            );
                        })}
                        <SprightChatInput
                            slot="input"
                            placeholder="Send a message…"
                            onSend={onChatInputSend}
                            sendDisabled={isStreaming}
                        ></SprightChatInput>
                        <span slot="end">AI-generated content may be incorrect.</span>
                    </SprightChatConversation>
                </div>
            </div>
        </SubContainer>
    );
}
