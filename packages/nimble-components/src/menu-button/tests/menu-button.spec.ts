import { DOM, elements, html } from '@microsoft/fast-element';
import { keyEnter, keySpace } from '@microsoft/fast-web-utilities';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { MenuButton } from '..';

async function setup(): Promise<Fixture<MenuButton>> {
    return fixture<MenuButton>(
        html`<nimble-menu-button></nimble-menu-button>`
    );
}

fdescribe('MenuButton', () => {
    let element: MenuButton;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let menu: HTMLElement;
    let menuItem1: HTMLElement;
    let menuItem2: HTMLElement;
    let menuItem3: HTMLElement;

    async function waitForOpenChange(): Promise<void> {
        return new Promise(resolve => {
            element.addEventListener('open-change', () => resolve());
        });
    }

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());

        // menu = document.createElement('div');
        // menu.setAttribute('role', 'menu');
        // menu.slot = 'menu';

        // menuItem1 = document.createElement('div');
        // menuItem1.textContent = 'menu item 1';
        // menu.setAttribute('role', 'menuitem');
        // menu.appendChild(menuItem1);

        // menuItem2 = document.createElement('li');
        // menuItem2.textContent = 'menu item 2';
        // menu.setAttribute('role', 'menuitem');
        // menu.appendChild(menuItem2);

        // menuItem3 = document.createElement('li');
        // menuItem3.textContent = 'menu item 3';
        // menu.setAttribute('role', 'menuitem');
        // menu.appendChild(menuItem3);

        // element.appendChild(menu);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-menu-button')).toBeInstanceOf(
            MenuButton
        );
    });

    it('should disable the toggle button when the disabled is `true`', async () => {
        element.disabled = true;
        await connect();
        expect(element.toggleButton!.disabled).toBe(true);
    });

    it('should set aria-haspopup on toggle button', async () => {
        await connect();
        expect(element.toggleButton!.getAttribute('aria-haspopup')).toEqual('true');
    });

    it('should set aria-expanded to true on the toggle button when the menu is open', async () => {
        element.open = true;
        await connect();
        expect(element.toggleButton!.getAttribute('aria-expanded')).toEqual('true');
    });

    it('should set aria-expanded to false on the toggle button when the menu is closed', async () => {
        await connect();
        expect(element.toggleButton!.getAttribute('aria-expanded')).toEqual('false');
    });

    it('should mark toggle button as checked when the menu is opened before connect', async () => {
        element.open = true;
        await connect();
        expect(element.toggleButton!.checked).toBe(true);
    });

    it('should mark toggle button as checked when the menu is opened after connect', async () => {
        await connect();
        element.open = true;
        DOM.processUpdates();
        expect(element.toggleButton!.checked).toBe(true);
        expect('true').toBe('true');
    });

    it('should mark toggle button as not checked when the menu is closed after connect', async () => {
        await connect();
        expect(element.toggleButton!.checked).toBe(false);
    });

    it('should default \'open\' to false', async () => {
        await connect();
        expect(element.open).toBe(false);
    });

    it('should not open menu when the toggle button is clicked if the element is disabled', async () => {
        element.disabled = true;
        await connect();
        element.toggleButton!.control.click();
        expect(element.open).toBe(false);
    });

    it('should close menu when toggle button is clicked while the menu is open', async () => {
        element.open = true;
        await connect();
        element.toggleButton!.control.click();
        expect(element.open).toBe(false);
    });

    it('should open the menu and focus first menu item when the toggle button is clicked', async () => {
        await connect();
        element.toggleButton!.control.click();
        expect(element.open).toBe(true);
        await waitForOpenChange();
        expect(document.activeElement).toEqual(menuItem1);
    });

    xit('should open the menu and focus first menu item when \'Enter\' is pressed while the toggle button is focused', async () => {

    });

    xit('should open the menu and focus first menu item when \'Space\' is pressed while the toggle button is focused', async () => {

    });

    xit('should open the menu and focus last menu item when the up arrow is pressed while the toggle button is focused', async () => {

    });

    xit('should open the menu and focus first menu item when the down arrow is pressed while the toggle button is focused', async () => {

    });

    xit('should not interact with form', async () => {

    });

    xit('should close the menu when pressing \'Escape\'', async () => {

    });

    xit('should close the menu when selecting a menu item', async () => {

    });

    xit('should not close the menu when clicking on a disabled menu item', async () => {

    });

    xit('should close the menu when the element loses focus', async () => {

    });

    xit('anchored-region should not exist in DOM when the menu is closed', async () => {

    });

    xit('anchored-region should exist in DOM when the menu is open', async () => {

    });

    xit('anchored-region should be configured correctly when the menu button position is configured to \'above\'', async () => {

    });

    xit('anchored-region should be configured correctly when the menu button position is configured to \'below\'', async () => {

    });

    xit('anchored-region should be configured correctly when the menu button position is configured to \'auto\'', async () => {

    });

    describe('events', () => {
        xit('should fire \'openChanged\' event when the menu is opened', async () => {
        });

        xit('should fire \'openChanged\' event when the menu is closed', async () => {
        });
    });
});