import { html } from '@ni/fast-element';
import {
    themeProviderTag,
    type ThemeProvider
} from '@ni/nimble-components/dist/esm/theme-provider';
import { LabelProviderChat, labelProviderChatTag } from '..';
import { chatSendLabel, chatStopLabel } from '../label-tokens';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

async function setup(): Promise<Fixture<ThemeProvider>> {
    return await fixture<ThemeProvider>(html`
        <${themeProviderTag}>
            <${labelProviderChatTag}></${labelProviderChatTag}>
        </${themeProviderTag}>
    `);
}

describe('Label Provider Chat', () => {
    let element: LabelProviderChat;
    let themeProvider: ThemeProvider;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        let connect: () => Promise<void>;
        ({ element: themeProvider, connect, disconnect } = await setup());
        element = themeProvider.querySelector(labelProviderChatTag)!;
        await connect();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(labelProviderChatTag)).toBeInstanceOf(
            LabelProviderChat
        );
    });

    it('provides default labels', () => {
        expect(chatSendLabel.getValueFor(themeProvider)).toBe('Send');
        expect(chatStopLabel.getValueFor(themeProvider)).toBe('Stop');
    });

    it('updates tokens from label attributes', () => {
        element.setAttribute('send', 'Send it!');
        element.setAttribute('stop', 'Stop it!');

        expect(chatSendLabel.getValueFor(themeProvider)).toBe('Send it!');
        expect(chatStopLabel.getValueFor(themeProvider)).toBe('Stop it!');
    });
});