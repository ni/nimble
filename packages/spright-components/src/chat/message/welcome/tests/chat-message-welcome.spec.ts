import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
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

async function setupWithBrandIcon(): Promise<Fixture<ChatMessageWelcome>> {
    return await fixture<ChatMessageWelcome>(
        // prettier-ignore
        html`<${chatMessageWelcomeTag}><div slot="brand-icon" class="custom-icon"></div></${chatMessageWelcomeTag}>`
    );
}

async function setupWithSubtitleContent(subtitle?: string): Promise<Fixture<ChatMessageWelcome>> {
    const subtitleAttr = subtitle ? `subtitle="${subtitle}"` : '';
    return await fixture<ChatMessageWelcome>(
        // prettier-ignore
        html`<${chatMessageWelcomeTag} ${subtitleAttr}><span slot="subtitle">Read the <a href="https://example.com">guide</a></span></${chatMessageWelcomeTag}>`
    );
}

describe('ChatMessageWelcome', () => {
    it('can construct an element instance', () => {
        expect(
            document.createElement(chatMessageWelcomeTag)
        ).toBeInstanceOf(ChatMessageWelcome);
    });

    describe('with no attributes', () => {
        let element: ChatMessageWelcome;
        let disconnect: () => Promise<void>;
        let pageObject: ChatMessageWelcomePageObject;

        beforeEach(async () => {
            let connect: () => Promise<void>;
            ({ element, connect, disconnect } = await setup());
            pageObject = new ChatMessageWelcomePageObject(element);
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should not render title element when title is not set', () => {
            expect(pageObject.isTitleRendered()).toBeFalse();
        });

        it('should not show the subtitle when it is not set', () => {
            expect(pageObject.isSubtitleRendered()).toBeFalse();
        });

        it('should display the default Nigel chat icon when no brand-icon slot content is provided', () => {
            expect(pageObject.getSlottedBrandIconNodes().length).toBe(0);
            expect(pageObject.hasBrandIconDefaultContent()).toBeTrue();
        });

        it('should display slotted content in the default slot', () => {
            expect(pageObject.getMessageContentSlottedText()).toContain('Welcome content');
        });
    });

    describe('with welcome title', () => {
        let disconnect: () => Promise<void>;
        let pageObject: ChatMessageWelcomePageObject;

        beforeEach(async () => {
            let element: ChatMessageWelcome;
            let connect: () => Promise<void>;
            ({ element, connect, disconnect } = await setup('Welcome to Nigel AI'));
            pageObject = new ChatMessageWelcomePageObject(element);
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should display the welcome title when set', () => {
            expect(pageObject.getTitleText()).toBe('Welcome to Nigel AI');
        });
    });

    describe('with subtitle', () => {
        let disconnect: () => Promise<void>;
        let pageObject: ChatMessageWelcomePageObject;

        beforeEach(async () => {
            let element: ChatMessageWelcome;
            let connect: () => Promise<void>;
            ({ element, connect, disconnect } = await setup(undefined, 'Chat below to get started'));
            pageObject = new ChatMessageWelcomePageObject(element);
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should display the subtitle when set', () => {
            expect(pageObject.getSubtitleText()).toBe('Chat below to get started');
        });
    });

    describe('with slotted subtitle content', () => {
        let element: ChatMessageWelcome;
        let disconnect: () => Promise<void>;

        beforeEach(async () => {
            let connect: () => Promise<void>;
            ({ element, connect, disconnect } = await setupWithSubtitleContent());
            await connect();
            await waitForUpdatesAsync();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should render inline HTML content in the subtitle', () => {
            const pageObject = new ChatMessageWelcomePageObject(element);

            expect(pageObject.isSubtitleRendered()).toBeTrue();
            expect(pageObject.getSlottedSubtitleText()).toBe('Read the guide');
            expect(pageObject.getSlottedSubtitleLinkHref()).toBe('https://example.com');
        });
    });

    describe('with subtitle attribute and slotted subtitle content', () => {
        let element: ChatMessageWelcome;
        let disconnect: () => Promise<void>;

        beforeEach(async () => {
            let connect: () => Promise<void>;
            ({ element, connect, disconnect } = await setupWithSubtitleContent('Attribute fallback'));
            await connect();
            await waitForUpdatesAsync();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should use slotted content and ignore the subtitle attribute', () => {
            const pageObject = new ChatMessageWelcomePageObject(element);

            expect(pageObject.isSubtitleRendered()).toBeTrue();
            expect(pageObject.getSlottedSubtitleText()).toBe('Read the guide');
            expect(pageObject.getSlottedSubtitleLinkHref()).toBe('https://example.com');
        });
    });

    describe('with welcome title and subtitle', () => {
        let disconnect: () => Promise<void>;
        let pageObject: ChatMessageWelcomePageObject;

        beforeEach(async () => {
            let element: ChatMessageWelcome;
            let connect: () => Promise<void>;
            ({ element, connect, disconnect } = await setup(
                'Welcome to Nigel AI',
                'Chat below to get started'
            ));
            pageObject = new ChatMessageWelcomePageObject(element);
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should display the welcome title when both title and subtitle are set', () => {
            expect(pageObject.getTitleText()).toBe('Welcome to Nigel AI');
        });

        it('should display the subtitle when both title and subtitle are set', () => {
            expect(pageObject.getSubtitleText()).toBe('Chat below to get started');
        });
    });

    describe('with slotted brand-icon content', () => {
        let element: ChatMessageWelcome;
        let disconnect: () => Promise<void>;
        let pageObject: ChatMessageWelcomePageObject;

        beforeEach(async () => {
            let connect: () => Promise<void>;
            ({ element, connect, disconnect } = await setupWithBrandIcon());
            pageObject = new ChatMessageWelcomePageObject(element);
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should display the slotted brand-icon content', () => {
            const slotted = pageObject.getSlottedBrandIconNodes();
            expect(slotted.length).toBe(1);
            expect(slotted[0]!.classList.contains('custom-icon')).toBeTrue();
        });
    });
});
