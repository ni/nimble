import { html } from '@ni/fast-element';
import { ChatMarkdownViewer, chatMarkdownViewerTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { ChatMarkdownViewerType } from '../types';

async function setup(): Promise<Fixture<ChatMarkdownViewer>> {
    return await fixture<ChatMarkdownViewer>(
        html`<${chatMarkdownViewerTag}>Some message</${chatMarkdownViewerTag}>`
    );
}

describe('ChatMarkdownViewer', () => {
    let element: ChatMarkdownViewer;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(chatMarkdownViewerTag)).toBeInstanceOf(
            ChatMarkdownViewer
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
        expect(element.messageType).toBe(ChatMarkdownViewerType.system);
    });
});
