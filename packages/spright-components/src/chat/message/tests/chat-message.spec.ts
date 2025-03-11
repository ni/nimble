import { html } from '@microsoft/fast-element';
import { buttonTag } from '@ni/nimble-components/src/button';
import { iconPencilTag } from '@ni/nimble-components/src/icons/pencil';
import { waitForUpdatesAsync } from '@ni/nimble-components/src/testing/async-helpers';
import { ChatMessage, chatMessageTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { ChatMessageType } from '../types';

async function setup(): Promise<Fixture<ChatMessage>> {
    return await fixture<ChatMessage>(
        html`<${chatMessageTag}>Some message</${chatMessageTag}>`
    );
}

async function setupInboundWithLeftActionButtons(): Promise<Fixture<ChatMessage>> {
    return await fixture<ChatMessage>(
        html`<${chatMessageTag}>
                <${buttonTag} slot='left' appearance='ghost' ContentHidden='true'>
                    <${iconPencilTag} slot='start' />
                    Edit
                </${buttonTag}>
                Some message
            </${chatMessageTag}>`
    );
}

describe('ChatMessage', () => {
    let element: ChatMessage;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(chatMessageTag)).toBeInstanceOf(
            ChatMessage
        );
    });

    it('should have a slot element in the shadow DOM', async () => {
        await connect();
        expect(element.shadowRoot?.querySelector('SLOT')).not.toBeNull();
        expect(
            element?.innerText?.includes('Some message', undefined)
        ).toBeTrue();
    });

    it("should initialize 'message-type' to default", async () => {
        await connect();
        expect(element.messageType).toBe(ChatMessageType.system);
    });

    describe('left action buttons', () => {
        beforeEach(async () => {
            ({ element, connect, disconnect } = await setupInboundWithLeftActionButtons());
        });

        it('outbound left action buttons should not be visible', async () => {
            await connect();
            element.setAttribute('message-type', 'outbound');
            await waitForUpdatesAsync();

            expect(element.querySelector('nimble-button')?.getAttribute('visible')).toBe('false');
        });
    });
});
