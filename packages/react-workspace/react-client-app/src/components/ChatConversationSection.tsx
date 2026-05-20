import { useState } from 'react';
import { NimbleAnchor } from '@ni/nimble-react/anchor';
import { NimbleButton } from '@ni/nimble-react/button';
import { NimbleBanner } from '@ni/nimble-react/banner';
import { NimbleSpinner } from '@ni/nimble-react/spinner';
import { NimbleIconCopyText } from '@ni/nimble-react/icons/copy-text';
import { NimbleIconWebviCustom } from '@ni/nimble-react/icons/webvi-custom';
import { SprightChatConversation } from '@ni/spright-react/chat/conversation';
import { SprightChatInput } from '@ni/spright-react/chat/input';
import { SprightChatMessageInbound } from '@ni/spright-react/chat/message/inbound';
import { SprightChatMessageOutbound } from '@ni/spright-react/chat/message/outbound';
import { SprightChatMessageSystem } from '@ni/spright-react/chat/message/system';
import { SubContainer } from './SubContainer';

export function ChatConversationSection(): React.JSX.Element {
    const [chatUserMessages, setChatUserMessages] = useState<string[]>([]);

    function onChatInputSend(event: CustomEvent<{ text: string }>): void {
        const text = event.detail.text;
        setChatUserMessages(prevMessages => [...prevMessages, text]);
    }

    return (
        <SubContainer label="Chat Conversation and Messages (Spright)">
            <SprightChatConversation>
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
                {chatUserMessages.map((message, index) => (
                    <SprightChatMessageOutbound key={index}>
                        <span>{message}</span>
                    </SprightChatMessageOutbound>
                ))}
                <SprightChatInput
                    slot="input"
                    placeholder="Type here"
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
