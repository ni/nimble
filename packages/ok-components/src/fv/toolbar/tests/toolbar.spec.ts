import { html } from '@ni/fast-element';
import { Button, buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconPencilTag } from '@ni/nimble-components/dist/esm/icons/pencil';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { FvToolbar, fvToolbarTag } from '..';

async function settle(): Promise<void> {
    await waitForUpdatesAsync();
    await waitForUpdatesAsync();
    await waitForUpdatesAsync();
    await waitForUpdatesAsync();
}

describe('FvToolbar', () => {
    let testFixture: Fixture<FvToolbar>;
    let element: FvToolbar;
    let buttons: Button[];

    beforeEach(async () => {
        testFixture = await fixture<FvToolbar>(html`
            <${fvToolbarTag} style="width: 1000px;" aria-label="Actions">
                <${buttonTag} slot="start" type="button" data-responsive="label icon overflow" data-priority="10">
                    <${iconPencilTag} slot="start"></${iconPencilTag}>
                    Edit selected assets
                </${buttonTag}>
                <${buttonTag} slot="start" type="button" data-responsive="label icon overflow">
                    <${iconPencilTag} slot="start"></${iconPencilTag}>
                    Duplicate selected assets
                </${buttonTag}>
                <${buttonTag} slot="end" type="button" data-responsive="label icon overflow">
                    <${iconPencilTag} slot="start"></${iconPencilTag}>
                    Export selected assets
                </${buttonTag}>
            </${fvToolbarTag}>
        `);
        element = testFixture.element;
        buttons = Array.from(element.querySelectorAll(buttonTag));
        await testFixture.connect();
        await settle();
    });

    afterEach(async () => {
        await testFixture.disconnect();
    });

    async function resize(width: number): Promise<void> {
        element.style.width = `${width}px`;
        await settle();
    }

    function expectFits(): void {
        const region = element.shadowRoot!.querySelector<HTMLElement>('.positioning-region')!;
        expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth);
    }

    async function expectConfigurationError(change: () => void, message: RegExp): Promise<void> {
        let layout: FrameRequestCallback | undefined;
        const frameSpy = spyOn(window, 'requestAnimationFrame').and.callFake(callback => {
            layout = callback;
            return 1;
        });
        change();
        await Promise.resolve();
        frameSpy.and.callThrough();
        expect(layout).toBeDefined();
        expect(() => layout!(0)).toThrowError(message);
    }

    it('rejects end-slot icons for the icon presentation', async () => {
        await expectConfigurationError(() => {
            buttons[0]!.querySelector('[slot="start"]')!.setAttribute('slot', 'end');
        }, /icon-only actions/);
    });

    it('rejects nested start-slot icons for the icon presentation', async () => {
        await expectConfigurationError(() => {
            const wrapper = document.createElement('span');
            wrapper.appendChild(buttons[0]!.querySelector('[slot="start"]')!);
            buttons[0]!.appendChild(wrapper);
        }, /icon-only actions/);
    });

    it('excludes comments while retaining text and non-slotted elements in overflow labels', async () => {
        const label = document.createElement('span');
        label.textContent = 'Export';
        buttons[0]!.setAttribute('data-responsive', 'label overflow');
        buttons[0]!.replaceChildren(
            document.createComment('internal note'),
            label,
            document.createTextNode(' selected assets')
        );
        await resize(100);
        expect(element.overflowMenu.firstElementChild!.textContent).toBe('Export selected assets');
    });

    it('rejects a comment-only action without an accessible label', async () => {
        await expectConfigurationError(() => {
            buttons[0]!.setAttribute('data-responsive', 'label overflow');
            buttons[0]!.replaceChildren(document.createComment('internal note'));
        }, /text label or aria-label/);
    });

    it('extends the Nimble toolbar and starts with labeled actions', () => {
        expect(element).toBeInstanceOf(FvToolbar);
        expect(element.getAttribute('role')).toBe('toolbar');
        expect(buttons.every(button => !button.contentHidden && !button.hidden)).toBeTrue();
        expect(element.overflowButton.hidden).toBeTrue();
    });

    it('collapses labels before overflowing and restores them on growth', async () => {
        await resize(220);
        expect(buttons.every(button => button.contentHidden && !button.hidden)).toBeTrue();
        expect(element.hasOverflow).toBeFalse();
        expectFits();
        await resize(1000);
        expect(buttons.every(button => !button.contentHidden && !button.hidden)).toBeTrue();
        expectFits();
    });

    it('overflows lower priorities first and preserves source order', async () => {
        await resize(140);
        expect(buttons[0]!.hidden).toBeFalse();
        expect(buttons[2]!.hidden).toBeTrue();
        expect(element.hasOverflow).toBeTrue();
        expectFits();
        await resize(100);
        expect(element.overflowMenu.children.length).toBe(3);
        expect(Array.from(element.overflowMenu.children).map(item => item.textContent)).toEqual([
            'Edit selected assets', 'Duplicate selected assets', 'Export selected assets'
        ]);
        expectFits();
        await resize(1000);
        expect(element.overflowMenu.children.length).toBe(0);
        expect(element.overflowButton.hidden).toBeTrue();
    });

    it('skips icon-only when it is not allowed', async () => {
        buttons[2]!.setAttribute('data-responsive', 'label overflow');
        await resize(220);
        expect(buttons[2]!.contentHidden).toBeFalse();
        expect(buttons[2]!.hidden).toBeTrue();
        expectFits();
    });

    it('supports icon-only and always-overflow actions', async () => {
        buttons[0]!.setAttribute('data-responsive', 'icon');
        buttons[1]!.setAttribute('data-responsive', 'overflow');
        await settle();
        expect(buttons[0]!.contentHidden).toBeTrue();
        expect(buttons[0]!.hidden).toBeFalse();
        expect(buttons[1]!.hidden).toBeTrue();
        expect(element.overflowMenu.children.length).toBe(1);
    });

    it('preserves click handlers and synchronizes disabled state and labels', async () => {
        const action = jasmine.createSpy('action');
        buttons[0]!.addEventListener('click', action);
        await resize(100);
        element.overflowMenu.firstElementChild!.dispatchEvent(new Event('change', { bubbles: true }));
        expect(action).toHaveBeenCalledTimes(1);
        buttons[0]!.disabled = true;
        buttons[0]!.setAttribute('aria-label', 'Edit assets');
        await settle();
        expect(element.overflowMenu.firstElementChild!.hasAttribute('disabled')).toBeTrue();
        expect(element.overflowMenu.firstElementChild!.textContent).toBe('Edit assets');
        element.overflowMenu.firstElementChild!.dispatchEvent(new Event('change', { bubbles: true }));
        expect(action).toHaveBeenCalledTimes(1);
    });

    it('responds to inserted and removed actions and restores removed items', async () => {
        await resize(100);
        const added = document.createElement(buttonTag);
        added.textContent = 'New action';
        added.setAttribute('data-responsive', 'label overflow');
        element.appendChild(added);
        await settle();
        expect(element.overflowMenu.lastElementChild!.textContent).toBe('New action');
        expect(added.hidden).toBeTrue();
        added.remove();
        await settle();
        expect(added.hidden).toBeFalse();
        expect(element.overflowMenu.children.length).toBe(3);
    });

    it('does not expose application-hidden actions in overflow', async () => {
        buttons[1]!.hidden = true;
        await resize(100);
        expect(element.overflowMenu.children.length).toBe(2);
        await resize(1000);
        expect(buttons[1]!.hidden).toBeTrue();
    });

    it('leaves pinned controls unchanged and permits scrolling when they cannot fit', async () => {
        buttons[0]!.removeAttribute('data-responsive');
        await resize(100);
        expect(buttons[0]!.hidden).toBeFalse();
        expect(buttons[0]!.contentHidden).toBeFalse();
        const region = element.shadowRoot!.querySelector<HTMLElement>('.positioning-region')!;
        expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
    });

    it('moves focus into overflow when the focused action is hidden', async () => {
        buttons[2]!.focus();
        expect(document.activeElement).toBe(buttons[2]!);
        await resize(100);
        expect(element.shadowRoot!.activeElement).toBe(element.overflowButton);
    });

    it('moves focus into overflow when the toolbar is inside a shadow root', async () => {
        const host = document.createElement('div');
        testFixture.parent.appendChild(host);
        const root = host.attachShadow({ mode: 'open' });
        root.appendChild(element);
        await settle();
        buttons[2]!.focus();
        expect(root.activeElement).toBe(buttons[2]!);
        await resize(100);
        expect(element.shadowRoot!.activeElement).toBe(element.overflowButton);
    });

    it('restores focus when a focused overflow trigger disappears', async () => {
        await resize(100);
        element.overflowButton.focus();
        await resize(1000);
        expect(document.activeElement).toBe(buttons[0]!);
    });

    it('restores focus to a pinned control when every responsive action is disabled', async () => {
        buttons[0]!.removeAttribute('data-responsive');
        buttons[0]!.textContent = 'Pinned';
        buttons[1]!.disabled = true;
        buttons[2]!.disabled = true;
        await resize(200);
        expect(element.hasOverflow).toBeTrue();
        element.overflowButton.focus();
        expect(element.shadowRoot!.activeElement).toBe(element.overflowButton);
        await resize(1000);
        expect(element.hasOverflow).toBeFalse();
        expect(document.activeElement).toBe(buttons[0]!);
    });

    it('includes the overflow trigger in toolbar arrow navigation', async () => {
        await resize(140);
        buttons[0]!.focus();
        buttons[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, composed: true }));
        expect(element.shadowRoot!.activeElement).toBe(element.overflowButton);
    });

    it('opens the menu with the keyboard, invokes an action once, and restores trigger focus', async () => {
        await resize(100);
        const action = jasmine.createSpy('action');
        buttons[0]!.addEventListener('click', action);
        element.overflowButton.focus();
        element.overflowButton.toggleButton!.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowDown', bubbles: true, composed: true, cancelable: true
        }));
        await settle();
        expect(element.overflowButton.open).toBeTrue();
        const firstItem = element.overflowMenu.firstElementChild!;
        firstItem.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter', bubbles: true, composed: true, cancelable: true
        }));
        await settle();
        expect(action).toHaveBeenCalledTimes(1);
        expect(element.overflowButton.open).toBeFalse();
        expect(element.shadowRoot!.activeElement).toBe(element.overflowButton);
    });

    it('keeps focus in an unchanged open menu when a layout is requested', async () => {
        await resize(100);
        element.overflowButton.open = true;
        await settle();
        const firstItem = element.overflowMenu.firstElementChild!;
        expect(element.shadowRoot!.activeElement).toBe(firstItem);
        const hiddenSpy = spyOnProperty(element.overflowButton, 'hidden', 'set').and.callThrough();
        element.setAttribute('class', 'updated');
        await settle();
        expect(hiddenSpy).not.toHaveBeenCalledWith(true);
        expect(element.overflowButton.open).toBeTrue();
        expect(element.shadowRoot!.activeElement).toBe(firstItem);
    });

    async function expectFocusAfterActionChange(change: 'remove' | 'unmanage'): Promise<void> {
        await resize(100);
        element.overflowButton.open = true;
        await settle();
        expect(element.shadowRoot!.activeElement).toBe(element.overflowMenu.firstElementChild);
        if (change === 'remove') {
            buttons[0]!.remove();
        } else {
            buttons[0]!.removeAttribute('data-responsive');
        }
        await settle();
        expect(element.hasOverflow).toBeTrue();
        expect(element.overflowButton.open).toBeFalse();
        expect(element.shadowRoot!.activeElement).toBe(element.overflowButton);
    }

    it('restores focus when a focused overflow action is removed', async () => {
        await expectFocusAfterActionChange('remove');
    });

    it('restores focus when a focused overflow action is no longer responsive', async () => {
        await expectFocusAfterActionChange('unmanage');
    });

    it('closes the menu with Escape and retains focus on its trigger', async () => {
        await resize(100);
        element.overflowButton.open = true;
        await settle();
        element.overflowMenu.firstElementChild!.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape', bubbles: true, composed: true, cancelable: true
        }));
        await settle();
        expect(element.overflowButton.open).toBeFalse();
        expect(element.shadowRoot!.activeElement).toBe(element.overflowButton);
    });

    it('uses RTL arrow navigation after reconnect', async () => {
        await testFixture.disconnect();
        element.dir = 'rtl';
        await testFixture.connect();
        await resize(140);
        buttons[0]!.focus();
        buttons[0]!.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowLeft', bubbles: true, composed: true, cancelable: true
        }));
        expect(element.shadowRoot!.activeElement).toBe(element.overflowButton);
        expectFits();
    });

    it('restores a managed action when responsive behavior is removed', async () => {
        await resize(100);
        buttons[0]!.removeAttribute('data-responsive');
        await settle();
        expect(buttons[0]!.hidden).toBeFalse();
        expect(buttons[0]!.contentHidden).toBeFalse();
        expect(element.overflowMenu.children.length).toBe(2);
    });

    it('restores original presentation on disconnect and refits on reconnect', async () => {
        await resize(100);
        await testFixture.disconnect();
        expect(buttons.every(button => !button.hidden && !button.contentHidden)).toBeTrue();
        await testFixture.connect();
        await settle();
        expect(element.overflowMenu.children.length).toBe(3);
    });

    it('keeps the fitted state stable across repeated resize notifications', async () => {
        await resize(140);
        const mutations: MutationRecord[] = [];
        const observer = new MutationObserver(records => mutations.push(...records));
        observer.observe(element, { subtree: true, attributes: true });
        await settle();
        observer.disconnect();
        expect(mutations.length).toBe(0);
    });
});
