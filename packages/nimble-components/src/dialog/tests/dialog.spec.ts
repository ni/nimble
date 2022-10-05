import { DesignSystem } from '@microsoft/fast-foundation';
import { DOM, html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Dialog, ExtendedDialog, UserDismissed } from '..';

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
async function setup<CloseReason = void>(
    preventDismiss = false
): Promise<Fixture<Dialog<CloseReason>>> {
    const viewTemplate = html`
        <nimble-dialog ?prevent-dismiss="${() => preventDismiss}">
            <nimble-button id="ok">OK</nimble-button>
            <nimble-button id="cancel">Cancel</nimble-button>
        </nimble-dialog>
        <nimble-button id="button1">Button 1</nimble-button>
        <nimble-button id="button2">Button 2</nimble-button>
    `;
    return fixture<Dialog<CloseReason>>(viewTemplate);
}

describe('Dialog', () => {
    function nativeDialogElement(nimbleDialogElement: Dialog): ExtendedDialog {
        return nimbleDialogElement.shadowRoot!.querySelector(
            'dialog'
        ) as ExtendedDialog;
    }

    it('should have its tag returned by tagFor(Dialog)', () => {
        expect(DesignSystem.tagFor(Dialog)).toBe('nimble-dialog');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-dialog')).toBeInstanceOf(Dialog);
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
        await DOM.nextUpdate();

        expect(getComputedStyle(nativeDialogElement(element)).display).toBe(
            'flex'
        );

        await disconnect();
    });

    it('should be hidden after calling close()', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        void element.show();
        await DOM.nextUpdate();
        element.close();
        await DOM.nextUpdate();

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
        await DOM.nextUpdate();

        expect(element.open).toBeTrue();

        await disconnect();
    });

    it('should set open to false after calling close()', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        void element.show();
        await DOM.nextUpdate();
        element.close();
        await DOM.nextUpdate();

        expect(element.open).toBeFalse();

        await disconnect();
    });

    it('should resolve promise when closed', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const dialogPromise = element.show();
        await DOM.nextUpdate();
        element.close();
        await DOM.nextUpdate();

        await expectAsync(dialogPromise).not.toBeRejectedWithError();

        await disconnect();
    });

    it('should resolve promise with value passed to close()', async () => {
        const { element, connect, disconnect } = await setup<string>();
        await connect();
        const expectedReason = 'just because';
        const dialogDromise = element.show();
        await DOM.nextUpdate();
        element.close(expectedReason);
        await DOM.nextUpdate();

        await expectAsync(dialogDromise).toBeResolvedTo(expectedReason);

        await disconnect();
    });

    it('should resolve promise with undefined when nothing passed to close()', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const dialogPromise = element.show();
        await DOM.nextUpdate();
        element.close();
        await DOM.nextUpdate();

        await expectAsync(dialogPromise).toBeResolvedTo(undefined);

        await disconnect();
    });

    it('should resolve promise with UserDismissed when cancel event fired', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const dialogPromise = element.show();
        await DOM.nextUpdate();
        // Simulate user dismiss events in browser
        const cancelEvent = new Event('cancel', { cancelable: true });
        nativeDialogElement(element).dispatchEvent(cancelEvent);
        nativeDialogElement(element).dispatchEvent(new Event('close'));
        await DOM.nextUpdate();

        await expectAsync(dialogPromise).toBeResolvedTo(UserDismissed);
        expect(cancelEvent.defaultPrevented).toBeFalse();
        expect(element.open).toBeFalse();

        await disconnect();
    });

    it('should dismiss an attempted cancel event when prevent-dismiss is enabled', async () => {
        const { element, connect, disconnect } = await setup(true);
        await connect();
        void element.show();
        await DOM.nextUpdate();
        // Simulate user dismiss events in browser that are cancelled
        const cancelEvent = new Event('cancel', { cancelable: true });
        nativeDialogElement(element).dispatchEvent(cancelEvent);
        await DOM.nextUpdate();

        expect(cancelEvent.defaultPrevented).toBeTrue();
        expect(element.open).toBeTrue();

        await disconnect();
    });

    it('throws calling show() a second time', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        void element.show();
        await DOM.nextUpdate();

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
        await DOM.nextUpdate();
        const afterDialogOpenActiveElement = document.activeElement;
        element.close();
        await DOM.nextUpdate();
        const afterDialogCloseActiveElement = document.activeElement;

        expect(initialActiveElement).toBe(button2);
        expect(afterDialogOpenActiveElement).not.toBe(button2);
        expect(afterDialogCloseActiveElement).toBe(button2);

        await disconnect();
    });

    it('focuses the first button on the dialog when it opens', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const okButton = document.getElementById('ok')!;
        void element.show();
        await DOM.nextUpdate();

        expect(document.activeElement).toBe(okButton);

        await disconnect();
    });

    it('focuses the button with autofocus when the dialog opens', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const cancelButton = document.getElementById('cancel')!;
        cancelButton.setAttribute('autofocus', '');
        await DOM.nextUpdate();
        void element.show();
        await DOM.nextUpdate();

        expect(document.activeElement).toBe(cancelButton);

        await disconnect();
    });

    it('supports opening multiple dialogs on top of each other', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const secondDialog = document.createElement('nimble-dialog');
        const secondDialogButton = document.createElement('nimble-button');
        secondDialog.append(secondDialogButton);
        element.parentElement!.append(secondDialog);
        await DOM.nextUpdate();
        void element.show();
        await DOM.nextUpdate();
        void secondDialog.show();
        await DOM.nextUpdate();

        expect(element.open).toBeTrue();
        expect(secondDialog.open).toBeTrue();
        expect(document.activeElement).toBe(secondDialogButton);

        await disconnect();
    });
});
