import { html } from '@ni/fast-element';
import { processUpdates } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { waitForEvent } from '@ni/nimble-components/dist/esm/utilities/testing/component';
import { ChatInput, chatInputTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { ChatInputPageObject } from '../testing/chat-input.pageobject';

async function setup(): Promise<Fixture<ChatInput>> {
    return await fixture<ChatInput>(html`<${chatInputTag}></${chatInputTag}>`);
}

describe('ChatInput', () => {
    let element: ChatInput;
    let page: ChatInputPageObject;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        page = new ChatInputPageObject(element);
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

        it('has no rendered text content', () => {
            expect(page.getRenderedText()).toEqual('');
        });

        it('shows placeholder', () => {
            const placeholder = 'My placeholder';
            element.placeholder = placeholder;
            processUpdates();
            expect(page.getPlaceholder()).toEqual(placeholder);
        });

        it('has disabled send button', () => {
            expect(page.isSendButtonEnabled()).toBeFalse();
        });
    });

    describe('value property set', () => {
        beforeEach(async () => {
            await connect();
        });

        it('is reflected in value property get', () => {
            element.value = 'new value';
            expect(element.value).toEqual('new value');
        });

        it('affects rendered text', () => {
            element.value = 'new value';
            processUpdates();
            expect(page.getRenderedText()).toEqual('new value');
        });

        it('before connect affects rendered text', async () => {
            await disconnect();
            element.value = 'new value';
            await connect();
            processUpdates();
            expect(page.getRenderedText()).toEqual('new value');
        });

        it('to non-empty value enables send button', () => {
            element.value = 'new value';
            processUpdates();
            expect(page.isSendButtonEnabled()).toBeTrue();
        });

        it('to empty value disables send button', () => {
            element.value = 'new value';
            processUpdates();
            element.value = '';
            processUpdates();
            expect(page.isSendButtonEnabled()).toBeFalse();
        });
    });

    describe('user input', () => {
        beforeEach(async () => {
            await connect();
        });

        it('is reflected in value property get', () => {
            page.setText('new value');
            expect(element.value).toEqual('new value');
        });

        it('affects rendered text', () => {
            page.setText('new value');
            expect(page.getRenderedText()).toEqual('new value');
        });

        it('to non-empty value enables send button', () => {
            page.setText('new value');
            expect(page.isSendButtonEnabled()).toBeTrue();
        });

        it('to empty value disables send button', () => {
            page.setText('new value');
            page.setText('');
            expect(page.isSendButtonEnabled()).toBeFalse();
        });

        it("Enter doesn't modify value", async () => {
            page.setText('new value');
            await page.pressEnterKey();
            expect(element.value).toEqual('new value');
        });

        it('Shift-Enter adds newline', async () => {
            page.setText('new value');
            await page.pressShiftEnterKey();
            expect(element.value).toEqual('new value\n');
        });
    });

    describe('send', () => {
        beforeEach(async () => {
            await connect();
        });

        it('via button click triggers send event with value as data', async () => {
            const spy = jasmine.createSpy();
            const sendListener = waitForEvent(element, 'send', spy);
            element.value = 'new value';
            processUpdates();

            page.clickSendButton();

            await sendListener;
            expect(spy).toHaveBeenCalledOnceWith(
                new CustomEvent('send', {
                    detail: { text: 'new value', newState: true }
                })
            );
        });

        it('via Enter triggers send event with value as data', async () => {
            const spy = jasmine.createSpy();
            const sendListener = waitForEvent(element, 'send', spy);
            element.value = 'new value';
            processUpdates();

            await page.pressEnterKey();

            await sendListener;
            expect(spy).toHaveBeenCalledOnceWith(
                new CustomEvent('send', {
                    detail: { text: 'new value', newState: true }
                })
            );
        });

        it('is called synchronously', () => {
            // This test exists to verify that the tests below are actually detecting the absence of a call,
            // and not just finishing before the call happens.
            const spy = jasmine.createSpy();
            element.addEventListener('send', spy);
            element.value = 'new value';
            processUpdates();
            page.clickSendButton();

            expect(spy).toHaveBeenCalled();
        });

        it('via button click with no text triggers no send event', () => {
            const spy = jasmine.createSpy();
            element.addEventListener('send', spy);
            processUpdates();
            page.clickSendButton();

            expect(spy).not.toHaveBeenCalled();
        });

        it('via Enter with no text triggers no send event', async () => {
            const spy = jasmine.createSpy();
            element.addEventListener('send', spy);
            processUpdates();
            await page.pressEnterKey();

            expect(spy).not.toHaveBeenCalled();
        });

        it('Shift-Enter triggers no send event', async () => {
            const spy = jasmine.createSpy();
            element.addEventListener('send', spy);
            element.value = 'new value';
            processUpdates();
            await page.pressShiftEnterKey();

            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('sendButtonLabel', () => {
        beforeEach(async () => {
            await connect();
        });

        it('defaults to undefined', () => {
            expect(element.sendButtonLabel).toBeUndefined();
        });

        it('affects button title and ARIA', () => {
            element.sendButtonLabel = 'Send it!';
            processUpdates();
            expect(page.getSendButtonTitle()).toEqual('Send it!');
            expect(page.getSendButtonTextContent()).toEqual('Send it!');
        });
    });

    describe('tabindex', () => {
        beforeEach(async () => {
            await connect();
        });

        it('defaults when unset', () => {
            expect(element.getAttribute('tabindex')).toBeNull();
            expect(element.tabIndex).toBeUndefined();
        });

        it('syncs to property and focusable controls when set', () => {
            element.setAttribute('tabindex', '-1');
            processUpdates();

            expect(element.getAttribute('tabindex')).toEqual('-1');
            expect(element.tabIndex).toEqual(-1);
            expect(page.getSendButtonTabIndex()).toEqual('-1');
            expect(page.getTextAreaTabIndex()).toEqual('-1');
        });

        it('syncs to property and focusable controls when cleared', () => {
            element.setAttribute('tabindex', '-1');
            processUpdates();
            element.removeAttribute('tabindex');
            processUpdates();

            expect(element.getAttribute('tabindex')).toBeNull();
            expect(element.tabIndex).toBeNull();
            expect(page.getSendButtonTabIndex()).toBeNull();
            expect(page.getTextAreaTabIndex()).toBeNull();
        });
    });
});
