import { html } from '@ni/fast-element';
import { processUpdates } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { ChatInput, chatInputTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { ChatInputPageObject } from '../testing/chat-input.pageobject';
import type { ChatInputSendEventDetail } from '../types';

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
        const sendSpy = jasmine.createSpy();
        beforeEach(async () => {
            await connect();
            element.addEventListener('send', sendSpy);
            sendSpy.calls.reset();
        });

        it('via button click triggers send event with value as data', () => {
            element.value = 'new value';
            processUpdates();

            page.clickSendButton();

            expect(sendSpy).toHaveBeenCalledTimes(1);
            const event = sendSpy.calls.mostRecent()
                .args[0] as CustomEvent<ChatInputSendEventDetail>;
            expect(event.detail.text).toEqual('new value');
        });

        it('via Enter triggers send event with value as data', async () => {
            element.value = 'new value';
            processUpdates();

            await page.pressEnterKey();

            expect(sendSpy).toHaveBeenCalledTimes(1);
            const event = sendSpy.calls.mostRecent()
                .args[0] as CustomEvent<ChatInputSendEventDetail>;
            expect(event.detail.text).toEqual('new value');
        });

        it('via button click with no text triggers no send event', () => {
            processUpdates();
            page.clickSendButton();

            expect(sendSpy).not.toHaveBeenCalled();
        });

        it('via Enter with no text triggers no send event', async () => {
            processUpdates();
            await page.pressEnterKey();

            expect(sendSpy).not.toHaveBeenCalled();
        });

        it('Shift-Enter triggers no send event', async () => {
            element.value = 'new value';
            processUpdates();
            await page.pressShiftEnterKey();

            expect(sendSpy).not.toHaveBeenCalled();
        });
    });

    describe('resetInput method', () => {
        beforeEach(async () => {
            await connect();
        });

        it('clears the input contents, sets focus, and disables the button', () => {
            page.setText('new value');
            element.resetInput();
            processUpdates();

            expect(element.value).toEqual('');
            expect(page.getRenderedText()).toEqual('');
            expect(page.textAreaHasFocus()).toBeTrue();
            expect(page.isSendButtonEnabled()).toBeFalse();
        });

        it('can be called from send event handler', async () => {
            const spy = jasmine.createSpy('send', () => {
                element.resetInput();
                processUpdates();

                expect(element.value).toEqual('');
                expect(page.getRenderedText()).toEqual('');
                expect(page.textAreaHasFocus()).toBeTrue();
                expect(page.isSendButtonEnabled()).toBeFalse();
            });

            element.addEventListener('send', spy);
            element.value = 'new value';
            processUpdates();

            await page.pressEnterKey();
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('can be called when not connected', async () => {
            element.value = 'hello';
            await disconnect();
            element.resetInput();
            await connect();
            processUpdates();
            expect(element.value).toEqual('');
            expect(page.getRenderedText()).toEqual('');
            expect(page.isSendButtonEnabled()).toBeFalse();
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
});
