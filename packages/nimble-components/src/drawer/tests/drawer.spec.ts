import { DOM, html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Drawer } from '..';
import { DrawerState } from '../types';
import { clickElement } from '../../utilities/tests/component';

async function setup(): Promise<Fixture<Drawer>> {
    return fixture<Drawer>(html` <nimble-drawer> </nimble-drawer>`);
}

describe('Drawer', () => {
    let element: Drawer;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        await DOM.nextUpdate();
    });

    afterEach(async () => {
        await disconnect();
    });

    async function waitForDrawerAnimationsCompleted(): Promise<void> {
        await Promise.all(
            element.dialog
                .getAnimations()
                .map(async animation => animation.finished)
        );
        await DOM.nextUpdate();
    }

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-drawer')).toBeInstanceOf(Drawer);
    });

    it('element is hidden and does not trap focus by default', async () => {
        expect(element.hidden).toBe(true);
        expect(element.trapFocus).toBe(false);
    });

    it('state=opening animates to shown/state=opened, and state=closing animates to hidden/state=closed', async () => {
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
        element.show();
        await DOM.nextUpdate();
        element.hide();
        await waitForDrawerAnimationsCompleted();
        expect(element.hidden).toBe(true);
        expect(element.state).toEqual('closed');
    });

    it('updates to "state" property fire the "state-change" event', async () => {
        const stateChange = jasmine.createSpy();
        element.addEventListener('state-change', stateChange);
        element.state = DrawerState.Opened;

        expect(stateChange.calls.count()).toEqual(1);
    });

    it('clicking the overlay fires the "overlay-click" event', async () => {
        const overlayClick = jasmine.createSpy();
        element.addEventListener('overlay-click', overlayClick);
        const drawerOverlay = element.shadowRoot!.querySelector('.overlay');
        await clickElement(drawerOverlay as HTMLElement);

        expect(overlayClick.calls.count()).toEqual(1);
    });
});
