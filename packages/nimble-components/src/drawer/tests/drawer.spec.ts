import { DOM, html } from '@microsoft/fast-element';
import { eventTransitionEnd } from '@microsoft/fast-web-utilities';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Drawer, USER_DISMISSED } from '..';
import { DrawerLocation } from '../types';

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
async function setup<CloseReason = void>(
    preventDismiss = false
): Promise<Fixture<Drawer<CloseReason>>> {
    const viewTemplate = html`
        <nimble-drawer ?prevent-dismiss="${() => preventDismiss}">
            <nimble-button id="ok">OK</nimble-button>
            <nimble-button id="cancel">Cancel</nimble-button>
        </nimble-drawer>
        <nimble-button id="button1">Button 1</nimble-button>
        <nimble-button id="button2">Button 2</nimble-button>
    `;
    return fixture<Drawer<CloseReason>>(viewTemplate);
}

describe('Drawer', () => {
    function nativeDialogElement(nimbleDrawerElement: Drawer | Drawer<string>): HTMLDialogElement {
        return nimbleDrawerElement.shadowRoot!.querySelector(
            'dialog'
        )!;
    }

    function completeAnimation(nimbleDrawerElement: Drawer | Drawer<string>): void {
        const dialog = nativeDialogElement(nimbleDrawerElement);
        dialog.dispatchEvent(new Event(eventTransitionEnd));
    }

    describe('with default setup', () => {
        let element: Drawer;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        function closeDrawerAndCompleteAnimation(nimbleDrawerElement: Drawer): void {
            nimbleDrawerElement.close();
            completeAnimation(nimbleDrawerElement);
        }

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('can construct an element instance', () => {
            expect(document.createElement('nimble-drawer')).toBeInstanceOf(Drawer);
        });

        it('should default the location to left', () => {
            expect(element.location).toBe(DrawerLocation.left);
        });

        it('should put dialog on left when location is set to left', () => {
            expect(getComputedStyle(nativeDialogElement(element)).left).toBe(
                '0px'
            );
        });

        it('should put dialog on left when location is set to right', async () => {
            element.location = DrawerLocation.right;
            await DOM.nextUpdate();
            expect(getComputedStyle(nativeDialogElement(element)).left).toBe(
                'auto'
            );
        });

        it('should initially be hidden', async () => {
            expect(getComputedStyle(nativeDialogElement(element)).display).toBe(
                'none'
            );
        });

        it('should be displayed after calling show()', async () => {
            void element.show();
            await DOM.nextUpdate();

            expect(getComputedStyle(nativeDialogElement(element)).display).toBe(
                'block'
            );
        });

        it('should be hidden after calling close()', async () => {
            void element.show();
            await DOM.nextUpdate();
            closeDrawerAndCompleteAnimation(element);
            await DOM.nextUpdate();

            expect(getComputedStyle(nativeDialogElement(element)).display).toBe(
                'none'
            );
        });

        it('should initialize open to false', async () => {
            expect(element.open).toBeFalse();
        });

        it('should set open to true after calling show()', async () => {
            void element.show();
            await DOM.nextUpdate();

            expect(element.open).toBeTrue();
        });

        it('should set open to false after calling close()', async () => {
            void element.show();
            await DOM.nextUpdate();
            closeDrawerAndCompleteAnimation(element);
            await DOM.nextUpdate();

            expect(element.open).toBeFalse();
        });

        it('should keep open as true while closing animation is in progress', async () => {
            void element.show();
            await DOM.nextUpdate();
            element.close();
            await DOM.nextUpdate();

            expect(element.open).toBeTrue();
        });

        it('should resolve promise when closed', async () => {
            const promise = element.show();
            await DOM.nextUpdate();
            closeDrawerAndCompleteAnimation(element);
            await DOM.nextUpdate();

            await expectAsync(promise).not.toBeRejectedWithError();
        });

        it('should not resolve promise while closing animation is in progress', async () => {
            const promise = element.show();
            await DOM.nextUpdate();
            element.close();
            await DOM.nextUpdate();

            await expectAsync(promise).toBePending();
        });

        it('should resolve promise if drawer completely opens before being closed', async () => {
            const promise = element.show();
            completeAnimation(element);
            await DOM.nextUpdate();
            closeDrawerAndCompleteAnimation(element);
            await DOM.nextUpdate();

            await expectAsync(promise).toBeResolved();
        });

        it('should resolve promise if drawer does not completely open before being closed', async () => {
            const promise = element.show();
            // Do not wait for open animation to complete
            await DOM.nextUpdate();
            closeDrawerAndCompleteAnimation(element);
            await DOM.nextUpdate();

            await expectAsync(promise).toBeResolved();
        });

        it('should resolve promise with undefined when nothing passed to close()', async () => {
            const promise = element.show();
            await DOM.nextUpdate();
            closeDrawerAndCompleteAnimation(element);
            await DOM.nextUpdate();

            await expectAsync(promise).toBeResolvedTo(undefined);
        });

        it('should resolve promise with USER_DISMISSED when cancel event fired', async () => {
            const promise = element.show();
            await DOM.nextUpdate();
            // Simulate user dismiss events in browser
            const cancelEvent = new Event('cancel', { cancelable: true });
            nativeDialogElement(element).dispatchEvent(cancelEvent);
            await DOM.nextUpdate();

            completeAnimation(element);

            await expectAsync(promise).toBeResolvedTo(USER_DISMISSED);
            expect(element.open).toBeFalse();
        });

        it('throws calling show() a second time', async () => {
            void element.show();
            await DOM.nextUpdate();

            await expectAsync(element.show()).toBeRejectedWithError();
        });

        it('throws calling close() before showing', async () => {
            expect(() => {
                element.close();
            }).toThrow();
        });

        it('throws calling close() before close animation completes', async () => {
            void element.show();
            await DOM.nextUpdate();
            element.close();
            expect(() => {
                element.close();
            }).toThrow();
        });

        it('forwards value of aria-label to dialog element', async () => {
            const expectedValue = 'doughnut';
            element.ariaLabel = expectedValue;
            await DOM.nextUpdate();

            expect(
                nativeDialogElement(element).getAttribute('aria-label')
            ).toEqual(expectedValue);
        });

        it('removes value of aria-label from dialog element when cleared from host', async () => {
            element.ariaLabel = 'not empty';
            await DOM.nextUpdate();
            element.ariaLabel = null;
            await DOM.nextUpdate();

            expect(
                nativeDialogElement(element).getAttribute('aria-label')
            ).toBeNull();
        });

        it('restores focus to the element that had it before opening', async () => {
            const button2 = document.getElementById('button2')!;
            button2.focus();
            const initialActiveElement = document.activeElement;
            void element.show();
            await DOM.nextUpdate();
            const afterDrawerOpenActiveElement = document.activeElement;
            closeDrawerAndCompleteAnimation(element);
            await DOM.nextUpdate();
            const afterDrawerCloseActiveElement = document.activeElement;

            expect(initialActiveElement).toBe(button2);
            expect(afterDrawerOpenActiveElement).not.toBe(button2);
            expect(afterDrawerCloseActiveElement).toBe(button2);
        });

        it('focuses the first button on the drawer when it opens', async () => {
            const okButton = document.getElementById('ok')!;
            void element.show();
            await DOM.nextUpdate();

            expect(document.activeElement).toBe(okButton);
        });

        it('focuses the button with autofocus when the drawer opens', async () => {
            const cancelButton = document.getElementById('cancel')!;
            cancelButton.setAttribute('autofocus', '');
            await DOM.nextUpdate();
            void element.show();
            await DOM.nextUpdate();

            expect(document.activeElement).toBe(cancelButton);
        });

        it('supports opening multiple drawers on top of each other', async () => {
            const secondDrawer = document.createElement('nimble-drawer');
            const secondDrawerButton = document.createElement('nimble-button');
            secondDrawer.append(secondDrawerButton);
            element.parentElement!.append(secondDrawer);
            await DOM.nextUpdate();
            void element.show();
            await DOM.nextUpdate();
            void secondDrawer.show();
            await DOM.nextUpdate();

            expect(element.open).toBeTrue();
            expect(secondDrawer.open).toBeTrue();
            expect(document.activeElement).toBe(secondDrawerButton);
        });
    });

    describe('with custom setup', () => {
        it('should resolve promise with value passed to close()', async () => {
            const { element, connect, disconnect } = await setup<string>();
            await connect();
            const expectedReason = 'just because';
            const promise = element.show();
            await DOM.nextUpdate();
            element.close(expectedReason);
            completeAnimation(element);
            await DOM.nextUpdate();

            await expectAsync(promise).toBeResolvedTo(expectedReason);

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

            expect(element.open).toBeTrue();

            await disconnect();
        });
    });
});
