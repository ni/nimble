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

async function setupWithBrandIcon(): Promise<Fixture<ChatMessageWelcome>> {
    return await fixture<ChatMessageWelcome>(
        // prettier-ignore
        html`<${chatMessageWelcomeTag}><div slot="brand-icon" class="custom-icon"></div></${chatMessageWelcomeTag}>`
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

        it('should not render subtitle element when subtitle is not set', () => {
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
