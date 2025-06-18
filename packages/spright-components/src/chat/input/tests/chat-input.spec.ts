import { html } from '@ni/fast-element';
import { ChatInput, chatInputTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

async function setup(): Promise<Fixture<ChatInput>> {
    return await fixture<ChatInput>(html`<${chatInputTag}></${chatInputTag}>`);
}

describe('ChatInput', () => {
    let element: ChatInput;
    let connect: () => Promise<void>;
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

    describe('initial state', () => {
        beforeEach(async () => {
            await connect();
        });

        it('has no rendered text content', async () => {
        });

        it('has disabled send button', async () => {
        });
    });

    describe('value property set', () => {
        beforeEach(async () => {
            await connect();
        });

        it('is reflected in value property get', async () => {
        });

        it('affects rendered text', async () => {
        });

        it('before connect affects rendered text', async () => {
        });

        it('to non-empty value enables send button', async () => {
        });

        it('to empty value disables send button', async () => {
        });
    });

    describe('user input', () => {
        beforeEach(async () => {
            await connect();
        });

        it('is reflected in value property get', async () => {
        });

        it('affects rendered text', async () => {
        });

        it('to non-empty value enables send button', async () => {
        });

        it('to empty value disables send button', async () => {
        });

        it('Enter doesn\'t modify value', async () => {
        });

        it('Shift-Enter adds newline and doesn\'t trigger send event', async () => {
        });
    });

    describe('send', () => {
        beforeEach(async () => {
            await connect();
        });

        it('via button click triggers send event with value as data', async () => {
        });

        it('via Enter triggers send event with value as data', async () => {
        });

        it('via Enter with no text triggers no send event', async () => {
        });
    });

    describe('reset method', () => {
        beforeEach(async () => {
            await connect();
        });

        it('clears the input contents, sets focus, and disables the button', async () => {
        });

        it('can be called from send event handler', async () => {
        });
    });

    describe('sendButtonLabel', () => {
        beforeEach(async () => {
            await connect();
        });

        it('defaults to empty', async () => {
        });

        it('affects button title and ARIA', async () => {
        });
    });
});
