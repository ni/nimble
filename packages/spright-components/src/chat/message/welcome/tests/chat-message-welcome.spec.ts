import { html } from '@ni/fast-element';
import {
    ChatMessageWelcome,
    chatMessageWelcomeTag
} from '..';
import { fixture, type Fixture } from '../../../../utilities/tests/fixture';
import { ChatMessageWelcomePageObject } from '../testing/chat-message-welcome.pageobject';

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
    let pageObject: ChatMessageWelcomePageObject;

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
        pageObject = new ChatMessageWelcomePageObject(element);
        expect(pageObject.getDefaultSlot()).not.toBeNull();
    });

    it('should display the welcome title when set', async () => {
        ({ element, connect, disconnect } = await setup(
            'Welcome to Nigel AI'
        ));
        await connect();
        pageObject = new ChatMessageWelcomePageObject(element);
        expect(pageObject.getTitleText()).toBe('Welcome to Nigel AI');
    });

    it('should display the subtitle when set', async () => {
        ({ element, connect, disconnect } = await setup(
            undefined,
            'Chat below to get started'
        ));
        await connect();
        pageObject = new ChatMessageWelcomePageObject(element);
        expect(pageObject.getSubtitleText()).toBe(
            'Chat below to get started'
        );
    });

    it('should not render title element when title is not set', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        pageObject = new ChatMessageWelcomePageObject(element);
        expect(pageObject.isTitleRendered()).toBeFalse();
    });

    it('should not render subtitle element when subtitle is not set', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        pageObject = new ChatMessageWelcomePageObject(element);
        expect(pageObject.isSubtitleRendered()).toBeFalse();
    });

    it('should have a brand-icon slot', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        pageObject = new ChatMessageWelcomePageObject(element);
        expect(pageObject.getBrandIconSlot()).not.toBeNull();
    });

    it('should display the default Nigel chat icon when no brand-icon slot content is provided', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        pageObject = new ChatMessageWelcomePageObject(element);
        expect(pageObject.getDefaultBrandIcon()).not.toBeNull();
    });

    it('should display the welcome title when both title and subtitle are set', async () => {
        ({ element, connect, disconnect } = await setup(
            'Welcome to Nigel AI',
            'Chat below to get started'
        ));
        await connect();
        pageObject = new ChatMessageWelcomePageObject(element);
        expect(pageObject.getTitleText()).toBe('Welcome to Nigel AI');
    });

    it('should display the subtitle when both title and subtitle are set', async () => {
        ({ element, connect, disconnect } = await setup(
            'Welcome to Nigel AI',
            'Chat below to get started'
        ));
        await connect();
        pageObject = new ChatMessageWelcomePageObject(element);
        expect(pageObject.getSubtitleText()).toBe(
            'Chat below to get started'
        );
    });

    it('should display slotted content in the default slot', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        pageObject = new ChatMessageWelcomePageObject(element);
        expect(pageObject.getInnerText().includes('Welcome content')).toBeTrue();
    });
});
