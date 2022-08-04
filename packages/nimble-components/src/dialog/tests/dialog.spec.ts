import { DesignSystem } from '@microsoft/fast-foundation';
import { DOM, html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Dialog, ExtendedDialog, UserDismissed, USER_DISMISSED } from '..';

async function setup(preventDismiss?: boolean): Promise<Fixture<Dialog>> {
    const viewTemplate = html`
        <nimble-dialog ${preventDismiss ? 'prevent-dismiss' : ''}>
        </nimble-dialog>
    `;
    return fixture<Dialog>(viewTemplate);
}

fdescribe('Dialog', () => {
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

    it('should be displayed after calling show()', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        void element.show();
        await DOM.nextUpdate();

        expect(getComputedStyle(nativeDialogElement(element)).display).toBe(
            'block'
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

        let fulfilled = false;
        let rejected = false;
        element.show().then(
            () => {
                fulfilled = true;
            },
            () => {
                rejected = true;
            }
        );
        await DOM.nextUpdate();

        expect(fulfilled).toBeFalse();
        expect(rejected).toBeFalse();

        element.close();
        await DOM.nextUpdate();

        expect(fulfilled).toBeTrue();
        expect(rejected).toBeFalse();

        await disconnect();
    });

    it('should resolve promise with value passed to close()', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        let reason = '';
        const expectedReason = 'just because';
        void element.show().then(x => {
            reason = x as string;
        });
        await DOM.nextUpdate();

        element.close(expectedReason);
        await DOM.nextUpdate();

        expect(reason).toBe(expectedReason);

        await disconnect();
    });

    it('should resolve promise with undefined when nothing passed to close()', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        let reason = '';
        void element.show().then(x => {
            reason = x as string;
        });
        await DOM.nextUpdate();

        element.close();
        await DOM.nextUpdate();

        expect(reason).toBeUndefined();

        await disconnect();
    });

    it('should resolve promise with USER_DISMISSED when cancel event fired', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        let reason;
        void element.show().then(x => {
            reason = x;
        });
        await DOM.nextUpdate();

        // We can't actually cause the dialog to close, but we can fake it by sending both cancel and close events.
        nativeDialogElement(element).dispatchEvent(new Event('cancel'));
        nativeDialogElement(element).dispatchEvent(new Event('close'));
        await DOM.nextUpdate();

        expect(element.open).toBeFalse();
        expect(reason as unknown as UserDismissed).toBe(USER_DISMISSED);

        await disconnect();
    });

    // We cannot simulate pressing ESC in a way that fires the cancel event and actually closes the dialog.
    // This prevents us from testing the prevent-dismiss attribute.

    it('throws calling show() a second time', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        void element.show();
        await DOM.nextUpdate();

        // For some reason doing expect(() => { void element.show(); }).toThrow() does not work,
        // so instead, assert that the rejected callback is called.
        let fulfilled = false;
        let rejected = false;
        element.show().then(
            () => {
                fulfilled = true;
            },
            () => {
                rejected = true;
            }
        );
        await DOM.nextUpdate();

        expect(fulfilled).toBeFalse();
        expect(rejected).toBeTrue();

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

    it('has default role of alertdialog', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(nativeDialogElement(element)?.getAttribute('role')).toBe(
            'alertdialog'
        );

        await disconnect();
    });

    it('forwards value of aria-label to dialog element', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        const expectedValue = 'doughnut';
        element.ariaLabel = expectedValue;
        await DOM.nextUpdate();

        expect(
            nativeDialogElement(element)?.getAttribute('aria-label')
        ).toEqual(expectedValue);

        await disconnect();
    });

    it('removes value of aria-label from dialog element when cleared from host', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        element.ariaLabel = 'not empty';
        await DOM.nextUpdate();

        element.ariaLabel = undefined;
        await DOM.nextUpdate();

        expect(
            nativeDialogElement(element)?.getAttribute('aria-label')
        ).toBeNull();

        await disconnect();
    });
});
