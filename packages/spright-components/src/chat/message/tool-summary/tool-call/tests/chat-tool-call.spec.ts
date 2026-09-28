import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fixture, type Fixture } from '../../../../../utilities/tests/fixture';
import { ChatToolCall, chatToolCallTag } from '..';
import { chatToolCallInputTag } from '../../tool-call-input';
import { ChatToolCallPageObject } from '../testing/chat-tool-call.pageobject';

async function setup(): Promise<Fixture<ChatToolCall>> {
    return await fixture<ChatToolCall>(html`
        <${chatToolCallTag} name="system search" status="warning">
            <${chatToolCallInputTag} name="take" value="25" value-type="number"></${chatToolCallInputTag}>
        </${chatToolCallTag}>
    `);
}

describe('ChatToolCall', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(chatToolCallTag)).toBeInstanceOf(ChatToolCall);
    });

    it('renders its name, status label, and input children', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const pageObject = new ChatToolCallPageObject(element);

        expect(pageObject.nameText).toBe('system search');
        expect(pageObject.statusText).toBe('Warning');
        expect(pageObject.inputElements.length).toBe(1);
        expect(element.getAttribute('role')).toBe('listitem');
        await disconnect();
    });

    it('normalizes unsupported statuses to unknown', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        element.setAttribute('status', 'unsupported');
        await waitForUpdatesAsync();

        expect(new ChatToolCallPageObject(element).statusText).toBe('Unknown');
        await disconnect();
    });

    it('renders untrusted names as text', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        element.name = '<svg onload="alert(1)"></svg>';
        await waitForUpdatesAsync();

        const pageObject = new ChatToolCallPageObject(element);
        expect(pageObject.nameText).toBe('<svg onload="alert(1)"></svg>');
        expect(element.shadowRoot?.querySelector('svg')).toBeNull();
        await disconnect();
    });
});