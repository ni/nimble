import { html } from '@ni/fast-element';
import { ChatInput, chatInputTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

async function setup(): Promise<Fixture<ChatInput>> {
    return await fixture<ChatInput>(html`<${chatInputTag}></${chatInputTag}>`);
}

describe('ChatInput', () => {
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(chatInputTag)).toBeInstanceOf(ChatInput);
    });

    // TODO: test cases
    // if text empty: send is disabled, enter doesn't send, enter doesn't modify text
    // text starts out empty and button starts out disabled
    // after send, text is empty and button is disabled and enter doesn't submit
});
