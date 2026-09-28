import { html } from '@ni/fast-element';
import { themeProviderTag } from '@ni/nimble-components/dist/esm/theme-provider';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fixture, type Fixture } from '../../../../utilities/tests/fixture';
import { labelProviderChatTag } from '../../../label-provider';
import { ChatMessageToolSummary, chatMessageToolSummaryTag } from '..';
import { chatToolCallTag } from '../tool-call';
import { ChatMessageToolSummaryPageObject } from '../testing/chat-message-tool-summary.pageobject';

async function setup(): Promise<Fixture<ChatMessageToolSummary>> {
    return await fixture<ChatMessageToolSummary>(html`
        <${chatMessageToolSummaryTag}></${chatMessageToolSummaryTag}>
    `);
}

function appendToolCall(
    summary: ChatMessageToolSummary,
    name: string,
    status: 'pending' | 'success'
): void {
    const toolCall = document.createElement(chatToolCallTag);
    toolCall.name = name;
    toolCall.status = status;
    summary.append(toolCall);
}

describe('ChatMessageToolSummary', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(chatMessageToolSummaryTag)).toBeInstanceOf(ChatMessageToolSummary);
    });

    it('renders no disclosure or misleading status when empty', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        const pageObject = new ChatMessageToolSummaryPageObject(element);
        expect(pageObject.disclosureButton).toBeNull();
        expect(pageObject.summaryText).toBeNull();
        await disconnect();
    });

    it('ignores unrelated slotted elements when deriving the count', async () => {
        const { element, connect, disconnect } = await setup();
        element.append(document.createElement('div'));
        appendToolCall(element, 'search', 'success');
        await connect();

        const pageObject = new ChatMessageToolSummaryPageObject(element);
        expect(pageObject.summaryText).toBe('Called 1 tool');
        expect(pageObject.assignedElements.length).toBe(2);
        await disconnect();
    });

    it('shows a pending tool name and responds to live status changes', async () => {
        const { element, connect, disconnect } = await setup();
        appendToolCall(element, 'search systems', 'pending');
        await connect();
        const pageObject = new ChatMessageToolSummaryPageObject(element);

        expect(pageObject.summaryText).toBe('search systems: Pending');
        element.querySelector(chatToolCallTag)!.status = 'success';
        await new Promise<void>(resolve => {
            queueMicrotask(resolve);
        });
        await waitForUpdatesAsync();
        expect(pageObject.summaryText).toBe('Called 1 tool');
        await disconnect();
    });

    it('toggles the list with native button disclosure semantics', async () => {
        const { element, connect, disconnect } = await setup();
        appendToolCall(element, 'search', 'success');
        await connect();
        const pageObject = new ChatMessageToolSummaryPageObject(element);
        const button = pageObject.disclosureButton!;

        expect(element.expanded).toBeFalse();
        expect(button.getAttribute('aria-expanded')).toBe('false');
        expect(pageObject.list!.hidden).toBeTrue();
        expect(button.getAttribute('aria-controls')).toBe(pageObject.list!.id);

        button.focus();
        button.click();
        await waitForUpdatesAsync();
        expect(element.expanded).toBeTrue();
        expect(element.hasAttribute('expanded')).toBeTrue();
        expect(button.getAttribute('aria-expanded')).toBe('true');
        expect(pageObject.list!.hidden).toBeFalse();
        expect(element.shadowRoot?.activeElement).toBe(button);
        await disconnect();
    });

    it('uses customized labels from the chat label provider', async () => {
        const fixtureResult = await fixture(html`
            <${themeProviderTag}>
                <${labelProviderChatTag}></${labelProviderChatTag}>
                <${chatMessageToolSummaryTag}>
                    <${chatToolCallTag} name="search" status="success"></${chatToolCallTag}>
                </${chatMessageToolSummaryTag}>
            </${themeProviderTag}>
        `);
        const summary = fixtureResult.element.querySelector(chatMessageToolSummaryTag)!;
        await fixtureResult.connect();
        const labelProvider = fixtureResult.element.querySelector(labelProviderChatTag)!;
        labelProvider.toolSummaryCalledOne = 'Invoked {count} utility';
        await waitForUpdatesAsync();

        expect(new ChatMessageToolSummaryPageObject(summary).summaryText).toBe('Invoked 1 utility');
        await fixtureResult.disconnect();
    });
});