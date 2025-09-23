import { html } from '@ni/fast-element';
import { ChatMarkdownViewer, chatMarkdownViewerTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

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
});
