import { html } from '@ni/fast-element';
import {
    ChatMessageWelcome,
    chatMessageWelcomeTag
} from '..';
import { fixture, type Fixture } from '../../../../utilities/tests/fixture';

async function setup(
    welcomeTitle?: string,
    subtitle?: string
): Promise<Fixture<ChatMessageWelcome>> {
    const titleAttr = welcomeTitle
        ? `welcome-title="${welcomeTitle}"`
        : '';
    const subtitleAttr = subtitle ? `subtitle="${subtitle}"` : '';
    return await fixture<ChatMessageWelcome>(
        // prettier-ignore
        html`<${chatMessageWelcomeTag} ${titleAttr} ${subtitleAttr}>Welcome content</${chatMessageWelcomeTag}>`
    );
}

describe('ChatMessageWelcome', () => {
    let element: ChatMessageWelcome;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement(chatMessageWelcomeTag)
        ).toBeInstanceOf(ChatMessageWelcome);
    });

    it('should have a default slot element in the shadow DOM', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        const slot = element.shadowRoot?.querySelector(
            'slot:not([name])'
        );
        expect(slot).not.toBeNull();
    });

    it('should display the welcome title when set', async () => {
        ({ element, connect, disconnect } = await setup(
            'Welcome to Nigel AI'
        ));
        await connect();
        const titleDiv = element.shadowRoot?.querySelector('.title');
        expect(titleDiv?.textContent?.trim()).toBe('Welcome to Nigel AI');
    });

    it('should display the subtitle when set', async () => {
        ({ element, connect, disconnect } = await setup(
            undefined,
            'Chat below to get started'
        ));
        await connect();
        const subtitleDiv = element.shadowRoot?.querySelector('.subtitle');
        expect(subtitleDiv?.textContent?.trim()).toBe(
            'Chat below to get started'
        );
    });

    it('should not render title element when title is not set', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        const titleDiv = element.shadowRoot?.querySelector('.title');
        expect(titleDiv).toBeNull();
    });

    it('should not render subtitle element when subtitle is not set', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        const subtitleDiv = element.shadowRoot?.querySelector('.subtitle');
        expect(subtitleDiv).toBeNull();
    });

    it('should have a brand-icon slot', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        const brandIconSlot = element.shadowRoot?.querySelector(
            'slot[name="brand-icon"]'
        );
        expect(brandIconSlot).not.toBeNull();
    });

    it('should render both title and subtitle when both are set', async () => {
        ({ element, connect, disconnect } = await setup(
            'Welcome to Nigel AI',
            'Chat below to get started'
        ));
        await connect();
        const titleDiv = element.shadowRoot?.querySelector('.title');
        const subtitleDiv = element.shadowRoot?.querySelector('.subtitle');
        expect(titleDiv?.textContent?.trim()).toBe('Welcome to Nigel AI');
        expect(subtitleDiv?.textContent?.trim()).toBe(
            'Chat below to get started'
        );
    });

    it('should display slotted content in the default slot', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        expect(
            element.innerText.includes('Welcome content')
        ).toBeTrue();
    });
});
