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
        expect(getComputedStyle(element.shadowRoot!.querySelector('dialog') as Element).display).toBe('none');
        await disconnect();
    });

    it('should be displayed after calling showModal()', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        void element.showModal();
        await DOM.nextUpdate();
        expect(getComputedStyle(element.shadowRoot!.querySelector('dialog') as Element).display).toBe('block');
        await disconnect();
    });

    it('should be hidden after calling close()', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        void element.showModal();
        await DOM.nextUpdate();
        element.close();
        await DOM.nextUpdate();
        expect(getComputedStyle(element.shadowRoot!.querySelector('dialog') as Element).display).toBe('none');
        await disconnect();
    });

    it('should emit close event when close() called', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const handler = jasmine.createSpy();
        element.addEventListener('close', handler);
        void element.showModal();
        element.close();
        expect(handler.calls.count()).toEqual(1);
        await disconnect();
    });
});
