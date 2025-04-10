import { html } from '@ni/fast-element';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { Dialog, dialogTag, UserDismissed } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { buttonTag } from '../../button';

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
async function setup<CloseReason = void>(
    preventDismiss = false
): Promise<Fixture<Dialog<CloseReason>>> {
    const viewTemplate = html`
        <${dialogTag} ?prevent-dismiss="${() => preventDismiss}">
            <${buttonTag} id="ok">OK</${buttonTag}>
            <${buttonTag} id="cancel">Cancel</${buttonTag}>
        </${dialogTag}>
        <${buttonTag} id="button1">Button 1</${buttonTag}>
        <${buttonTag} id="button2">Button 2</${buttonTag}>
    `;
    return await fixture<Dialog<CloseReason>>(viewTemplate);
}

describe('Dialog', () => {
    function nativeDialogElement(
        nimbleDialogElement: Dialog
    ): HTMLDialogElement {
        return nimbleDialogElement.shadowRoot!.querySelector('dialog')!;
    }

    it('can construct an element instance', () => {
        expect(document.createElement(dialogTag)).toBeInstanceOf(Dialog);
    });

    it('should initially be hidden', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(getComputedStyle(nativeDialogElement(element)).display).toBe(
            'none'
        );

        await disconnect();
    });

    it('should use flex display for items in the default slot', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        const section = nativeDialogElement(element).querySelector('section')!;
        expect(getComputedStyle(section).display).toBe('flex');

        await disconnect();
    });

    it('should be displayed after calling show()', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        void element.show();
        await waitForUpdatesAsync();

        expect(getComputedStyle(nativeDialogElement(element)).display).toBe(
            'flex'
        );

        await disconnect();
    });

    it('should be hidden after calling close()', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        void element.show();
        await waitForUpdatesAsync();
        element.close();
        await waitForUpdatesAsync();

        expect(getComputedStyle(nativeDialogElement(element)).display).toBe(
            'none'
        );

        await disconnect();
    });

    it('should initialize open to false', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(element.open).toBeFalse();

        await disconnect();
    });

    it('should set open to true after calling show()', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        void element.show();
        await waitForUpdatesAsync();

        expect(element.open).toBeTrue();

        await disconnect();
    });

    it('should set open to false after calling close()', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        void element.show();
        await waitForUpdatesAsync();
        element.close();
        await waitForUpdatesAsync();

        expect(element.open).toBeFalse();

        await disconnect();
    });

    it('should resolve promise when closed', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const dialogPromise = element.show();
        await waitForUpdatesAsync();
        element.close();
        await waitForUpdatesAsync();

        await expectAsync(dialogPromise).not.toBeRejectedWithError();

        await disconnect();
    });

    it('should resolve promise with value passed to close()', async () => {
        const { element, connect, disconnect } = await setup<string>();
        await connect();
        const expectedReason = 'just because';
        const dialogDromise = element.show();
        await waitForUpdatesAsync();
        element.close(expectedReason);
        await waitForUpdatesAsync();

        await expectAsync(dialogDromise).toBeResolvedTo(expectedReason);

        await disconnect();
    });

    it('should resolve promise with undefined when nothing passed to close()', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const dialogPromise = element.show();
        await waitForUpdatesAsync();
        element.close();
        await waitForUpdatesAsync();

        await expectAsync(dialogPromise).toBeResolvedTo(undefined);

        await disconnect();
    });

    it('should resolve promise with UserDismissed when cancel event fired', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const dialogPromise = element.show();
        await waitForUpdatesAsync();
        // Simulate user dismiss events in browser
        const cancelEvent = new Event('cancel', { cancelable: true });
        nativeDialogElement(element).dispatchEvent(cancelEvent);
        nativeDialogElement(element).dispatchEvent(new Event('close'));
        await waitForUpdatesAsync();

        await expectAsync(dialogPromise).toBeResolvedTo(UserDismissed);
        expect(cancelEvent.defaultPrevented).toBeFalse();
        expect(element.open).toBeFalse();

        await disconnect();
    });

    // This can potentially happen if the dialog is implemented with the CloseWatcher API
    it('should resolve promise with UserDismissed when only close event fired', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const dialogPromise = element.show();
        await waitForUpdatesAsync();
        // Simulate user dismiss events in browser
        nativeDialogElement(element).dispatchEvent(new Event('close'));
        await waitForUpdatesAsync();

        await expectAsync(dialogPromise).toBeResolvedTo(UserDismissed);
        expect(element.open).toBeFalse();

        await disconnect();
    });

    it('should not resolve promise when close event bubbles from descendant', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const dialogPromise = element.show();
        const okButton = document.getElementById('ok')!;
        okButton.dispatchEvent(new Event('close', { bubbles: true }));
        await waitForUpdatesAsync();

        await expectAsync(dialogPromise).toBePending();
        expect(element.open).toBeTrue();

        await disconnect();
    });

    it('should dismiss an attempted cancel event when prevent-dismiss is enabled', async () => {
        const { element, connect, disconnect } = await setup(true);
        await connect();
        void element.show();
        await waitForUpdatesAsync();
        // Simulate user dismiss events in browser that are cancelled
        const cancelEvent = new Event('cancel', { cancelable: true });
        nativeDialogElement(element).dispatchEvent(cancelEvent);
        await waitForUpdatesAsync();

        expect(cancelEvent.defaultPrevented).toBeTrue();
        expect(element.open).toBeTrue();

        await disconnect();
    });

    it('throws calling show() a second time', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        void element.show();
        await waitForUpdatesAsync();

        await expectAsync(element.show()).toBeRejectedWithError();

        await disconnect();
    });

    it('throws calling close() before showing', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(() => {
            element.close();
        }).toThrow();

        await disconnect();
    });

    it('has default role of dialog', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(nativeDialogElement(element)?.getAttribute('role')).toBe(
            'dialog'
        );

        await disconnect();
    });

    it('restores focus to the element that had it before opening', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const button2 = document.getElementById('button2')!;
        button2.focus();
        const initialActiveElement = document.activeElement;
        void element.show();
        await waitForUpdatesAsync();
        const afterDialogOpenActiveElement = document.activeElement;
        element.close();
        await waitForUpdatesAsync();
        const afterDialogCloseActiveElement = document.activeElement;

        expect(initialActiveElement).toBe(button2);
        expect(afterDialogOpenActiveElement).not.toBe(button2);
        expect(afterDialogCloseActiveElement).toBe(button2);

        await disconnect();
    });

    // Some browsers skipped, see: https://github.com/ni/nimble/issues/1936
    it('focuses the first button on the dialog when it opens #SkipFirefox #SkipWebkit', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const okButton = document.getElementById('ok')!;
        void element.show();
        await waitForUpdatesAsync();

        expect(document.activeElement).toBe(okButton);

        await disconnect();
    });

    // Some browsers skipped, see: https://github.com/ni/nimble/issues/1936
    it('focuses the button with autofocus when the dialog opens #SkipFirefox #SkipWebkit', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const cancelButton = document.getElementById('cancel')!;
        cancelButton.setAttribute('autofocus', '');
        await waitForUpdatesAsync();
        void element.show();
        await waitForUpdatesAsync();

        expect(document.activeElement).toBe(cancelButton);

        await disconnect();
    });

    // Some browsers skipped, see: https://github.com/ni/nimble/issues/1936
    it('supports opening multiple dialogs on top of each other #SkipFirefox #SkipWebkit', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const secondDialog = document.createElement(dialogTag);
        const secondDialogButton = document.createElement(buttonTag);
        secondDialog.append(secondDialogButton);
        element.parentElement!.append(secondDialog);
        await waitForUpdatesAsync();
        void element.show();
        await waitForUpdatesAsync();
        void secondDialog.show();
        await waitForUpdatesAsync();

        expect(element.open).toBeTrue();
        expect(secondDialog.open).toBeTrue();
        expect(document.activeElement).toBe(secondDialogButton);

        await disconnect();
    });
});
