import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import { textAreaTag } from '@ni/nimble-components/dist/esm/text-area';
import { selectTag } from '@ni/nimble-components/dist/esm/select';
import { numberFieldTag } from '@ni/nimble-components/dist/esm/number-field';
import { fixture } from '../../../utilities/tests/fixture';
import {
    BulkEditFieldStatus,
    type FvBulkEditField,
    fvBulkEditFieldTag
} from '..';

describe('FvBulkEditField', () => {
    let element: FvBulkEditField;
    let disconnect: (() => Promise<void>) | undefined;

    beforeEach(async () => {
        let connect: () => Promise<void>;
        ({ element, connect, disconnect } = await fixture<FvBulkEditField>(html`
            <${fvBulkEditFieldTag} label="Location">
                <${textFieldTag}></${textFieldTag}>
                <${textAreaTag}></${textAreaTag}>
                <${selectTag}></${selectTag}>
                <${numberFieldTag}></${numberFieldTag}>
            </${fvBulkEditFieldTag}>
        `));
        await connect();
    });

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('renders mixed, changed, and will-clear status text', async () => {
        element.status = BulkEditFieldStatus.mixed;
        await waitForUpdatesAsync();
        expect(element.shadowRoot!.querySelector('.status')!.textContent).toContain('Mixed values');

        element.status = BulkEditFieldStatus.changed;
        await waitForUpdatesAsync();
        expect(element.shadowRoot!.querySelector('.status')!.textContent).toContain('Changed');

        element.status = BulkEditFieldStatus.willClear;
        await waitForUpdatesAsync();
        expect(element.shadowRoot!.querySelector('.status')!.textContent).toContain('Will clear');
    });

    it('emits enabled actions and suppresses disabled actions', () => {
        const resetSpy = jasmine.createSpy();
        const clearSpy = jasmine.createSpy();
        element.addEventListener('reset', resetSpy);
        element.addEventListener('clear', clearSpy);

        element.resetDisabled = true;
        element.reset();
        element.clear();
        expect(resetSpy).not.toHaveBeenCalled();
        expect(clearSpy).toHaveBeenCalledTimes(1);

        element.resetDisabled = false;
        element.clearDisabled = true;
        element.reset();
        element.clear();
        expect(resetSpy).toHaveBeenCalledTimes(1);
        expect(clearSpy).toHaveBeenCalledTimes(1);
    });

    it('enables reset by default and disables it only when reset-disabled is present', async () => {
        await waitForUpdatesAsync();
        const resetButton = element.shadowRoot!.querySelector('nimble-button')!;
        expect(element.resetDisabled).toBeFalse();
        expect(resetButton.disabled).toBeFalse();

        element.setAttribute('reset-disabled', '');
        await waitForUpdatesAsync();
        expect(element.resetDisabled).toBeTrue();
        expect(resetButton.disabled).toBeTrue();

        element.removeAttribute('reset-disabled');
        await waitForUpdatesAsync();
        expect(element.resetDisabled).toBeFalse();
        expect(resetButton.disabled).toBeFalse();
    });

    it('keeps the control left edge fixed for every status', async () => {
        const content = element.shadowRoot!.querySelector<HTMLElement>('.content')!;
        const initialLeft = content.getBoundingClientRect().left;

        element.status = BulkEditFieldStatus.changed;
        await waitForUpdatesAsync();

        expect(content.getBoundingClientRect().left).toBe(initialLeft);
    });

    it('names every supported slotted control and describes mixed values', async () => {
        element.status = BulkEditFieldStatus.mixed;
        await waitForUpdatesAsync();

        for (const control of element.children) {
            expect(control.getAttribute('aria-label')).toBe('Location. Mixed values. Enter a value to overwrite all selected rows.');
        }
    });

    it('updates the control description without shifting or renaming the control', async () => {
        element.status = BulkEditFieldStatus.willClear;
        await waitForUpdatesAsync();
        expect(element.firstElementChild!.getAttribute('aria-label')).toBe('Location. Will clear');
        element.label = 'Owner';
        element.status = BulkEditFieldStatus.unchanged;
        await waitForUpdatesAsync();
        expect(element.firstElementChild!.getAttribute('aria-label')).toBe('Owner');
    });

    it('retains the control label after reconnecting the editor', async () => {
        const parent = element.parentElement!;
        element.remove();
        parent.append(element);
        await waitForUpdatesAsync();

        for (const control of element.children) {
            expect(control.getAttribute('aria-label')).toBe('Location');
        }
    });
});
