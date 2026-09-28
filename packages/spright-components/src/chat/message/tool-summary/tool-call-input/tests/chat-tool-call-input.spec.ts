import { html } from '@ni/fast-element';
import { fixture, type Fixture } from '../../../../../utilities/tests/fixture';
import { ChatToolCallInput, chatToolCallInputTag } from '..';
import { ChatToolCallInputPageObject } from '../testing/chat-tool-call-input.pageobject';

async function setup(
    name?: string,
    value?: string,
    valueType?: string
): Promise<Fixture<ChatToolCallInput>> {
    const fixtureResult = await fixture<ChatToolCallInput>(html`
        <${chatToolCallInputTag}></${chatToolCallInputTag}>
    `);
    fixtureResult.element.name = name;
    fixtureResult.element.value = value;
    if (valueType !== undefined) {
        fixtureResult.element.setAttribute('value-type', valueType);
    }
    return fixtureResult;
}

describe('ChatToolCallInput', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(chatToolCallInputTag)).toBeInstanceOf(ChatToolCallInput);
    });

    it('renders string values as quoted text', async () => {
        const { element, connect, disconnect } = await setup('filter', 'workspace: engineering', 'string');
        await connect();
        const pageObject = new ChatToolCallInputPageObject(element);

        expect(pageObject.nameText).toBe('filter');
        expect(pageObject.valueText).toBe('"workspace: engineering"');
        await disconnect();
    });

    it('renders number and boolean values directly', async () => {
        const numberFixture = await setup('take', '25', 'number');
        await numberFixture.connect();
        expect(new ChatToolCallInputPageObject(numberFixture.element).valueText).toBe('25');
        await numberFixture.disconnect();

        const booleanFixture = await setup('enabled', 'true', 'boolean');
        await booleanFixture.connect();
        expect(new ChatToolCallInputPageObject(booleanFixture.element).valueText).toBe('true');
        await booleanFixture.disconnect();
    });

    it('normalizes valid JSON and falls back to text for malformed JSON', async () => {
        const validFixture = await setup('paths', '[ "Line1.*", "Line2.*" ]', 'json');
        await validFixture.connect();
        expect(new ChatToolCallInputPageObject(validFixture.element).valueText).toBe('["Line1.*","Line2.*"]');
        await validFixture.disconnect();

        const invalidFixture = await setup('paths', '[invalid', 'json');
        await invalidFixture.connect();
        expect(new ChatToolCallInputPageObject(invalidFixture.element).valueText).toBe('[invalid');
        await invalidFixture.disconnect();
    });

    it('tolerates missing names and unsupported value types', async () => {
        const { element, connect, disconnect } = await setup(undefined, '<b>unsafe</b>', 'unsupported');
        await connect();
        const pageObject = new ChatToolCallInputPageObject(element);

        expect(pageObject.nameText).toBeNull();
        expect(pageObject.valueText).toBe('"<b>unsafe</b>"');
        expect(element.shadowRoot?.querySelector('b')).toBeNull();
        await disconnect();
    });
});