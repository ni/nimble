import { DOM, html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Drawer, UserDismissed } from '..';
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
    function nativeDialogElement(
        nimbleDrawerElement: Drawer | Drawer<string>
    ): HTMLDialogElement {
        return nimbleDrawerElement.shadowRoot!.querySelector('dialog')!;
    }

    function isDrawerAnimating(
        nimbleDrawerElement: Drawer | Drawer<string>
    ): boolean {
        const dialogElement = nativeDialogElement(nimbleDrawerElement);
        return dialogElement.classList.contains('animating');
    }

    async function completeAnimationAsync(
        nimbleDrawerElement: Drawer | Drawer<string>
    ): Promise<void> {
        while (isDrawerAnimating(nimbleDrawerElement)) {
            // eslint-disable-next-line no-await-in-loop
            await DOM.nextUpdate();
        }
    }

    describe('with default setup', () => {
        let element: Drawer;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('can construct an element instance', () => {
            expect(document.createElement('nimble-drawer')).toBeInstanceOf(
                Drawer
            );
        });

        it('should default the location to right', () => {
            expect(element.location).toBe(DrawerLocation.right);
        });

        it('should initially be hidden', () => {
            expect(getComputedStyle(nativeDialogElement(element)).display).toBe(
                'none'
            );
        });

        it('should be displayed after calling show()', () => {
            void element.show();
            expect(getComputedStyle(nativeDialogElement(element)).display).toBe(
                'block'
            );
        });

        it('should be hidden after calling close()', async () => {
            const promise = element.show();
            element.close();
            await promise;
            expect(getComputedStyle(nativeDialogElement(element)).display).toBe(
                'none'
            );
        });

        it('should initialize open to false', () => {
            expect(element.open).toBeFalse();
        });

        it('should set open to true after calling show()', () => {
            void element.show();
            expect(element.open).toBeTrue();
        });

        it('should set open to false after calling close() and waiting for the animation to complete', async () => {
            const promise = element.show();
            element.close();
            await promise;
            expect(element.open).toBeFalse();
        });

        it('should keep open as true while the closing animation is in progress', () => {
            void element.show();
            element.close();
            expect(isDrawerAnimating(element)).toBeTrue();
            expect(element.open).toBeTrue();
        });

        it('should resolve promise when closed', async () => {
            const promise = element.show();
            element.close();
            await expectAsync(promise).toBeResolved();
        });

        it('should not resolve promise while closing animation is in progress', async () => {
            const promise = element.show();
            element.close();
            expect(isDrawerAnimating(element)).toBeTrue();
            // toBePending does not wait for the promise to fulfill
            await expectAsync(promise).toBePending();
        });

        it('should resolve promise if drawer completely opens before being closed', async () => {
            const promise = element.show();
            await completeAnimationAsync(element);
            element.close();
            await expectAsync(promise).toBeResolved();
        });

        it('should resolve promise if drawer does not completely open before being closed', async () => {
            const promise = element.show();
            // Do not wait for open animation to complete
            expect(isDrawerAnimating(element)).toBeTrue();
            element.close();
            await expectAsync(promise).toBeResolved();
        });

        it('should resolve promise with undefined when nothing passed to close()', async () => {
            const promise = element.show();
            element.close();
            await expectAsync(promise).toBeResolvedTo(undefined);
        });

        it('should resolve promise with UserDismissed when cancel event fired', async () => {
            const promise = element.show();
            // Simulate user dismiss event in browser
            const cancelEvent = new Event('cancel', { cancelable: true });
            nativeDialogElement(element).dispatchEvent(cancelEvent);
            await expectAsync(promise).toBeResolvedTo(UserDismissed);
            expect(element.open).toBeFalse();
        });

        it('throws calling show() a second time', async () => {
            void element.show();
            await expectAsync(element.show()).toBeRejectedWithError();
        });

        it('throws calling close() before showing', () => {
            expect(() => {
                element.close();
            }).toThrow();
        });

        it('throws calling close() a second time before the close animation completes', () => {
            void element.show();
            element.close();
            expect(() => {
                element.close();
            }).toThrow();
        });

        it('forwards value of aria-label to internal dialog element', () => {
            const expectedValue = 'doughnut';
            element.ariaLabel = expectedValue;
            DOM.processUpdates();
            expect(
                nativeDialogElement(element).getAttribute('aria-label')
            ).toEqual(expectedValue);
        });

        it('removes value of aria-label from internal dialog element when cleared from host', () => {
            element.ariaLabel = 'not empty';
            DOM.processUpdates();
            element.ariaLabel = null;
            DOM.processUpdates();
            expect(
                nativeDialogElement(element).getAttribute('aria-label')
            ).toBeNull();
        });

        it('restores focus to the element that had it before opening', async () => {
            const button2 = document.getElementById('button2')!;
            button2.focus();
            const initialActiveElement = document.activeElement;
            const promise = element.show();
            const afterDrawerOpenActiveElement = document.activeElement;
            element.close();
            await promise;
            const afterDrawerCloseActiveElement = document.activeElement;

            expect(initialActiveElement).toBe(button2);
            expect(afterDrawerOpenActiveElement).not.toBe(button2);
            expect(afterDrawerCloseActiveElement).toBe(button2);
        });

        it('focuses the first button on the drawer when it opens', async () => {
            const okButton = document.getElementById('ok')!;
            void element.show();
            expect(document.activeElement).toBe(okButton);
        });

        it('focuses the button with autofocus when the drawer opens', async () => {
            const cancelButton = document.getElementById('cancel')!;
            cancelButton.setAttribute('autofocus', '');
            DOM.processUpdates();
            void element.show();
            expect(document.activeElement).toBe(cancelButton);
        });

        it('supports opening multiple drawers on top of each other', async () => {
            const secondDrawer = document.createElement('nimble-drawer');
            const secondDrawerButton = document.createElement('nimble-button');
            secondDrawer.append(secondDrawerButton);
            element.parentElement!.append(secondDrawer);
            void element.show();
            void secondDrawer.show();

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
            element.close(expectedReason);
            await expectAsync(promise).toBeResolvedTo(expectedReason);

            await disconnect();
        });

        it('should not dismiss the drawer when a cancel event occurs if prevent-dismiss is true', async () => {
            const { element, connect, disconnect } = await setup(true);
            await connect();
            void element.show();
            // Wait for the opening animation to complete so that we can later check that an
            // animation is not in progess.
            await completeAnimationAsync(element);
            // Simulate user dismiss event in browser
            const cancelEvent = new Event('cancel', { cancelable: true });
            nativeDialogElement(element).dispatchEvent(cancelEvent);
            DOM.processUpdates();

            expect(element.open).toBeTrue();
            // The drawer should not be closing
            expect(isDrawerAnimating(element)).toBeFalse();

            await disconnect();
        });
    });
});
