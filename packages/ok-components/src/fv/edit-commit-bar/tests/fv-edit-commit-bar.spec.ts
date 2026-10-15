import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fixture } from '../../../utilities/tests/fixture';
import { type FvEditCommitBar, fvEditCommitBarTag } from '..';

describe('FvEditCommitBar', () => {
    let element: FvEditCommitBar;
    let disconnect: (() => Promise<void>) | undefined;

    beforeEach(async () => {
        let connect: () => Promise<void>;
        ({ element, connect, disconnect } = await fixture<FvEditCommitBar>(html`
            <${fvEditCommitBarTag} heading="Bulk Edit — 5 rows"></${fvEditCommitBarTag}>
        `));
        await connect();
    });

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('formats pending summaries', () => {
        expect(element.summary).toBe('No pending changes');

        element.changeCount = 1;
        element.affectedRowCount = 1;
        expect(element.summary).toBe('1 unsaved change in 1 row');

        element.changeCount = 2;
        element.affectedRowCount = 5;
        element.hiddenAffectedRowCount = 3;
        expect(element.summary).toBe('2 unsaved changes in 5 rows (3 hidden)');
    });

    it('updates rendered summaries as initially unused counts change', async () => {
        element.changeCount = 1;
        element.affectedRowCount = 2;
        await waitForUpdatesAsync();
        const summary = element.shadowRoot!.querySelector('.summary')!;
        expect(summary.textContent?.trim()).toBe('1 unsaved change in 2 rows');

        element.hiddenAffectedRowCount = 1;
        await waitForUpdatesAsync();
        expect(summary.textContent?.trim()).toBe('1 unsaved change in 2 rows (1 hidden)');

        element.changeCount = 0;
        await waitForUpdatesAsync();
        expect(summary.textContent?.trim()).toBe('No pending changes');
    });

    it('emits enabled save and revert actions', () => {
        const saveSpy = jasmine.createSpy();
        const revertSpy = jasmine.createSpy();
        element.addEventListener('save', saveSpy);
        element.addEventListener('revert', revertSpy);

        element.save();
        element.revert();

        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(revertSpy).toHaveBeenCalledTimes(1);
    });

    it('supports heading actions and hiding its built-in actions', async () => {
        const action = document.createElement('button');
        action.slot = 'heading-actions';
        action.textContent = 'Edit mode';
        element.append(action);
        await waitForUpdatesAsync();
        const slot = element.shadowRoot!.querySelector<HTMLSlotElement>('.heading slot[name="heading-actions"]')!;
        expect(slot.assignedElements()).toEqual([action]);
        expect(element.shadowRoot!.querySelector('.actions')).not.toBeNull();

        element.actionsHidden = true;
        await waitForUpdatesAsync();
        expect(element.shadowRoot!.querySelector('.actions')).toBeNull();
        expect(slot.assignedElements()).toEqual([action]);
    });

    it('hides only the empty summary when requested', async () => {
        element.hideEmptySummary = true;
        await waitForUpdatesAsync();
        expect(element.shadowRoot!.querySelector('.summary')).toBeNull();

        element.changeCount = 1;
        await waitForUpdatesAsync();
        expect(element.shadowRoot!.querySelector('.summary')?.textContent?.trim()).toBe('1 unsaved change in 0 rows');
    });

    it('renders information and error messages with matching live priority', async () => {
        element.message = { severity: 'information', text: 'Saved' };
        await waitForUpdatesAsync();
        let banner = element.shadowRoot!.querySelector('nimble-banner')!;
        expect(banner.severity).toBe('information');
        expect(banner.ariaLive).toBe('polite');

        element.message = { severity: 'error', text: 'Save failed' };
        await waitForUpdatesAsync();
        banner = element.shadowRoot!.querySelector('nimble-banner')!;
        expect(banner.severity).toBe('error');
        expect(banner.ariaLive).toBe('assertive');

        element.message = undefined;
        await waitForUpdatesAsync();
        expect(element.shadowRoot!.querySelector('nimble-banner')).toBeNull();
    });

    it('emits dismiss-message when the banner is dismissed', () => {
        const dismissSpy = jasmine.createSpy();
        element.addEventListener('dismiss-message', dismissSpy);

        element.handleBannerToggle(new CustomEvent('toggle', {
            detail: { oldState: true, newState: false }
        }));

        expect(dismissSpy).toHaveBeenCalledTimes(1);
    });

    it('hides dismissed feedback and reopens it when the message is replaced', async () => {
        const dismissSpy = jasmine.createSpy();
        element.addEventListener('dismiss-message', dismissSpy);
        element.message = { severity: 'information', text: 'Saved' };
        await waitForUpdatesAsync();
        const banner = element.shadowRoot!.querySelector('nimble-banner')!;
        expect(getComputedStyle(banner).display).not.toBe('none');

        banner.shadowRoot!.querySelector('nimble-button')!.click();
        await waitForUpdatesAsync();
        expect(banner.open).toBeFalse();
        expect(getComputedStyle(banner).display).toBe('none');
        expect(dismissSpy).toHaveBeenCalledTimes(1);

        element.message = { severity: 'error', text: 'Save failed' };
        await waitForUpdatesAsync();
        expect(banner.open).toBeTrue();
        expect(getComputedStyle(banner).display).not.toBe('none');
        expect(banner.textContent).toBe('Save failed');
    });
});
