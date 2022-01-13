import { DOM, html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import '..';
import type { Drawer } from '..';
import { DrawerState } from '../types';

async function createFixture(modal: boolean): Promise<Fixture<Drawer>> {
    return fixture<Drawer>(
        html`<nimble-drawer modal="${modal}">
            <textarea></textarea>
        </nimble-drawer>`
    );
}

describe('Drawer', () => {
    let drawerFixture: Fixture<Drawer>;
    let element: Drawer;
    let focusableChild: HTMLTextAreaElement;

    async function setup(modal = true): Promise<void> {
        drawerFixture = await createFixture(modal);
        await drawerFixture.connect();
        await DOM.nextUpdate();
        element = drawerFixture.element;
        focusableChild = element.firstElementChild as HTMLTextAreaElement;
    }

    afterEach(async () => {
        await drawerFixture.disconnect();
    });

    async function waitForDrawerAnimationsCompleted(): Promise<void> {
        await Promise.all(
            element.dialog
                .getAnimations()
                .map(async animation => animation.finished)
        );
        await DOM.nextUpdate();
    }

    it('element is hidden by default', async () => {
        await setup();
        expect(element.hidden).toBe(true);
    });

    describe('element trapFocus default matches modal', () => {
        [true, false].forEach(modal => {
            it(`when modal is initialized as ${modal.toString()}`, async () => {
                await setup(modal);
                expect(element.trapFocus).toBe(modal);
            });
        });
    });

    it('first focusable element in modal drawer is focused when drawer is opened', async () => {
        await setup(true);
        element.state = DrawerState.Opened;
        await DOM.nextUpdate();
        expect(document.activeElement).toBe(focusableChild);
    });

    it('non-modal drawer does not take focus when opened', async () => {
        await setup(false);
        element.state = DrawerState.Opened;
        await DOM.nextUpdate();
        expect(
            document.activeElement === null
                || !element.contains(document.activeElement)
        ).toBe(true);
    });

    it('drawer trapFocus (focusing behavior) updates when modal property is changed', async () => {
        await setup(true);
        element.modal = false;
        element.state = DrawerState.Opened;
        await DOM.nextUpdate();
        expect(
            document.activeElement === null
                || !element.contains(document.activeElement)
        ).toBe(true);
        element.state = DrawerState.Closed;
        await DOM.nextUpdate();
        element.modal = true;
        element.state = DrawerState.Opened;
        await DOM.nextUpdate();
        expect(document.activeElement).toBe(focusableChild);
    });

    it('state=opening animates to shown/state=opened, and state=closing animates to hidden/state=closed', async () => {
        await setup();
        element.state = DrawerState.Opening;
        await waitForDrawerAnimationsCompleted();
        expect(element.hidden).toBe(false);
        expect(element.state).toEqual('opened');
        element.state = DrawerState.Closing;
        await waitForDrawerAnimationsCompleted();
        expect(element.hidden).toBe(true);
        expect(element.state).toEqual('closed');
    });

    it('show() is equivalent to state=opening, and hide() is equivalent to state=closing', async () => {
        await setup();
        element.show();
        await waitForDrawerAnimationsCompleted();
        expect(element.hidden).toBe(false);
        expect(element.state).toEqual('opened');
        element.hide();
        await waitForDrawerAnimationsCompleted();
        expect(element.hidden).toBe(true);
        expect(element.state).toEqual('closed');
    });

    it('showing then hiding element (without waiting for slide-in animation to finish) works correctly (element ends as hidden)', async () => {
        await setup();
        element.show();
        await DOM.nextUpdate();
        element.hide();
        await waitForDrawerAnimationsCompleted();
        expect(element.hidden).toBe(true);
        expect(element.state).toEqual('closed');
    });

    it('updates to "state" property fire the "state-change" event', async () => {
        await setup();
        const stateChange = jasmine.createSpy();
        element.addEventListener('state-change', stateChange);
        element.state = DrawerState.Opened;

        expect(stateChange.calls.count()).toEqual(1);
    });
});
