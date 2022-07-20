import {
    DesignSystem
} from '@microsoft/fast-foundation';
import { DOM, html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Dialog } from '..';

async function setup(
    preventDismiss?: boolean
): Promise<Fixture<Dialog>> {
    const viewTemplate = html`
        <nimble-dialog
            ${preventDismiss ? 'prevent-dismiss' : ''}
        >
        </nimble-dialog>
    `;
    return fixture<Dialog>(viewTemplate);
}

fdescribe('Dialog', () => {
    function nativeDialogElement(nimbleDialogElement: Element): HTMLDialogElement {
        return nimbleDialogElement.shadowRoot!.querySelector('dialog')!;
    }

    it('should have its tag returned by tagFor(Dialog)', () => {
        expect(DesignSystem.tagFor(Dialog)).toBe('nimble-dialog');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-dialog')).toBeInstanceOf(
            Dialog
        );
    });

    it('should initially be hidden', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        expect(getComputedStyle(nativeDialogElement(element)).display).toBe('none');
        await disconnect();
    });

    it('should be displayed after calling showModal()', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        void element.showModal();
        await DOM.nextUpdate();

        expect(getComputedStyle(nativeDialogElement(element)).display).toBe('block');

        await disconnect();
    });

    it('should be hidden after calling close()', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        void element.showModal();
        await DOM.nextUpdate();
        element.close();
        await DOM.nextUpdate();

        expect(getComputedStyle(nativeDialogElement(element)).display).toBe('none');

        await disconnect();
    });

    it('should resolve promise when closed', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        let fulfilled = false;
        let rejected = false;
        element.showModal().then(() => { fulfilled = true; }, () => { rejected = true; });
        await DOM.nextUpdate();

        expect(fulfilled).toBeFalse();
        expect(rejected).toBeFalse();

        element.close();
        await DOM.nextUpdate();

        expect(fulfilled).toBeTrue();
        expect(rejected).toBeFalse();

        await disconnect();
    });

    it('should emit close event when close() called', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        const handler = jasmine.createSpy();
        element.addEventListener('close', handler);
        void element.showModal();
        element.close();
        await DOM.nextUpdate();

        expect(handler.calls.count()).toEqual(1);

        await disconnect();
    });

    it('forwards value of role to dialog element', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        const expectedValue = 'doughnut';
        element.role = expectedValue;
        await DOM.nextUpdate();

        expect(nativeDialogElement(element)?.getAttribute('role')).toEqual(expectedValue);

        await disconnect();
    });

    it('removes value of role from dialog element when cleared from host', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        element.role = 'not empty';
        await DOM.nextUpdate();

        element.role = null;
        await DOM.nextUpdate();

        expect(nativeDialogElement(element)?.getAttribute('role')).toBeNull();

        await disconnect();
    });

    it('forwards value of aria-describedby to dialog element', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        const expectedValue = 'doughnut';
        element.ariaDescribedBy = expectedValue;
        await DOM.nextUpdate();

        expect(nativeDialogElement(element)?.getAttribute('aria-describedby')).toEqual(expectedValue);

        await disconnect();
    });

    it('removes value of aria-describedby from dialog element when cleared from host', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        element.ariaDescribedBy = 'not empty';
        await DOM.nextUpdate();

        element.ariaDescribedBy = null;
        await DOM.nextUpdate();

        expect(nativeDialogElement(element)?.getAttribute('aria-describedby')).toBeNull();

        await disconnect();
    });

    it('forwards value of aria-labelledby to dialog element', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        const expectedValue = 'doughnut';
        element.ariaLabelledBy = expectedValue;
        await DOM.nextUpdate();

        expect(nativeDialogElement(element)?.getAttribute('aria-labelledby')).toEqual(expectedValue);

        await disconnect();
    });

    it('removes value of aria-labelledby from dialog element when cleared from host', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        element.ariaLabelledBy = 'not empty';
        await DOM.nextUpdate();

        element.ariaLabelledBy = null;
        await DOM.nextUpdate();

        expect(nativeDialogElement(element)?.getAttribute('aria-labelledby')).toBeNull();

        await disconnect();
    });

    it('forwards value of aria-label to dialog element', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        const expectedValue = 'doughnut';
        element.ariaLabel = expectedValue;
        await DOM.nextUpdate();

        expect(nativeDialogElement(element)?.getAttribute('aria-label')).toEqual(expectedValue);

        await disconnect();
    });

    it('removes value of aria-label from dialog element when cleared from host', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        element.ariaLabel = 'not empty';
        await DOM.nextUpdate();

        element.ariaLabel = null;
        await DOM.nextUpdate();

        expect(nativeDialogElement(element)?.getAttribute('aria-label')).toBeNull();

        await disconnect();
    });
});
