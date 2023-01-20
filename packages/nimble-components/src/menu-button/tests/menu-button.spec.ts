import { DOM, html } from '@microsoft/fast-element';
import {
    eventChange,
    keyArrowDown,
    keyArrowUp,
    keyEnter,
    keyEscape,
    keySpace
} from '@microsoft/fast-web-utilities';
import { FoundationElement, Menu, MenuItem } from '@microsoft/fast-foundation';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { MenuButton } from '..';
import { MenuButtonBeforeToggleEventDetail, MenuButtonPosition } from '../types';

class TestSlottedElement extends FoundationElement {}
const foo = TestSlottedElement.compose({
    baseName: 'test-slotted-element',
    template: html`
        <nimble-menu-button>
            <slot slot="menu" name="test-menu"></slot>
        </nimble-menu-button>
    `
});

async function setup(): Promise<Fixture<MenuButton>> {
    return fixture<MenuButton>(html`<nimble-menu-button></nimble-menu-button>`);
}

async function slottedSetup(): Promise<Fixture<TestSlottedElement>> {
    return fixture(foo());
}

/** A helper function to abstract adding an `open-change` event listener, spying
 * on the event being called, and removing the event listener. The returned promise
 * should be resolved prior to completing a test.
 */
function createOpenChangeListener(menuButton: MenuButton): {
    promise: Promise<void>,
    spy: jasmine.Spy
} {
    const spy = jasmine.createSpy();
    return {
        promise: new Promise(resolve => {
            const handler = (...args: unknown[]): void => {
                menuButton.removeEventListener('open-change', handler);
                spy(...args);
                resolve();
            };
            menuButton.addEventListener('open-change', handler);
        }),
        spy
    };
}

/** A helper function to abstract adding a `beforetoggle` event listener, spying
 * on the event being called, and removing the event listener. The returned promise
 * should be resolved prior to completing a test.
 *
 * The function asserts that the menu button has the expected `open` value when the
 * `beforetoggle` is fired and that when the `beforetoggle` event is fired, the
 * `openChangedSpy` has not been called.
 */
function createBeforeToggleListener(menuButton: MenuButton, expectedOpenState: boolean, openChangedSpy: jasmine.Spy): {
    promise: Promise<void>,
    spy: jasmine.Spy
} {
    const spy = jasmine.createSpy();
    return {
        promise: new Promise(resolve => {
            const handler = (...args: unknown[]): void => {
                expect(menuButton.open).toEqual(expectedOpenState);
                expect(openChangedSpy).not.toHaveBeenCalled();

                menuButton.removeEventListener('beforetoggle', handler);
                spy(...args);
                resolve();
            };
            menuButton.addEventListener('beforetoggle', handler);
        }),
        spy
    };
}

fdescribe('MenuButton2', () => {
    let parent: HTMLElement;
    let element: TestSlottedElement;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let menu: Menu;
    let menuItem1: MenuItem;
    let menuItem2: MenuItem;
    let menuItem3: MenuItem;

    function getMenuButton(): MenuButton {
        return element.shadowRoot!.querySelector('nimble-menu-button')!;
    }

    beforeEach(async () => {
        ({ element, connect, disconnect, parent } = await slottedSetup());

        menu = document.createElement('nimble-menu');
        menu.slot = 'test-menu';

        menuItem1 = document.createElement('nimble-menu-item');
        menuItem1.textContent = 'menu item 1';
        menu.appendChild(menuItem1);

        menuItem2 = document.createElement('nimble-menu-item');
        menuItem2.textContent = 'menu item 2';
        menu.appendChild(menuItem2);

        menuItem3 = document.createElement('nimble-menu-item');
        menuItem3.textContent = 'menu item 3';
        menu.appendChild(menuItem3);

        element.appendChild(menu);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should open the menu and focus first menu item when the toggle button is clicked', async () => {
        await connect();
        const menuButton = getMenuButton();
        const openChangeListener = createOpenChangeListener(menuButton);
        menuButton.toggleButton!.control.click();
        expect(menuButton.open).toBeTrue();
        await openChangeListener.promise;
        expect(document.activeElement).toEqual(menuItem1);
    });

    it('should open the menu and focus first menu item when the down arrow is pressed while the toggle button is focused', async () => {
        await connect();
        const openChangeListener = createOpenChangeListener(element);
        const event = new KeyboardEvent('keydown', {
            key: keyArrowDown
        } as KeyboardEventInit);
        element.toggleButton!.dispatchEvent(event);
        expect(element.open).toBeTrue();
        await openChangeListener.promise;
        expect(document.activeElement).toEqual(menuItem1);
    });
});

fdescribe('MenuButton', () => {
    let parent: HTMLElement;
    let element: MenuButton;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let menu: Menu;
    let menuItem1: MenuItem;
    let menuItem2: MenuItem;
    let menuItem3: MenuItem;

    beforeEach(async () => {
        ({ element, connect, disconnect, parent } = await setup());

        menu = document.createElement('nimble-menu');
        menu.slot = 'menu';

        menuItem1 = document.createElement('nimble-menu-item');
        menuItem1.textContent = 'menu item 1';
        menu.appendChild(menuItem1);

        menuItem2 = document.createElement('nimble-menu-item');
        menuItem2.textContent = 'menu item 2';
        menu.appendChild(menuItem2);

        menuItem3 = document.createElement('nimble-menu-item');
        menuItem3.textContent = 'menu item 3';
        menu.appendChild(menuItem3);

        element.appendChild(menu);
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
        expect(element.toggleButton!.disabled).toBeTrue();
    });

    it('should set aria-haspopup on toggle button', async () => {
        await connect();
        expect(element.toggleButton!.getAttribute('aria-haspopup')).toEqual(
            'true'
        );
    });

    it('should set aria-expanded to true on the toggle button when the menu is open', async () => {
        element.open = true;
        await connect();
        expect(element.toggleButton!.getAttribute('aria-expanded')).toEqual(
            'true'
        );
    });

    it('should set aria-expanded to false on the toggle button when the menu is closed', async () => {
        await connect();
        expect(element.toggleButton!.getAttribute('aria-expanded')).toEqual(
            'false'
        );
    });

    it('should mark the toggle button as checked when the menu is opened before connect', async () => {
        element.open = true;
        await connect();
        expect(element.toggleButton!.checked).toBeTrue();
    });

    it('should mark the toggle button as checked when the menu is opened after connect', async () => {
        await connect();
        element.open = true;
        DOM.processUpdates();
        expect(element.toggleButton!.checked).toBeTrue();
    });

    it('should not mark the toggle button as checked when the menu is not open', async () => {
        await connect();
        expect(element.toggleButton!.checked).toBeFalse();
    });

    it("should default 'open' to false", async () => {
        await connect();
        expect(element.open).toBeFalse();
    });

    it('should not open menu when the toggle button is clicked if the element is disabled', async () => {
        element.disabled = true;
        await connect();
        element.toggleButton!.control.click();
        expect(element.open).toBeFalse();
    });

    it('should close menu when toggle button is clicked while the menu is open', async () => {
        element.open = true;
        await connect();
        element.toggleButton!.control.click();
        expect(element.open).toBeFalse();
    });

    it('should open the menu and focus first menu item when the toggle button is clicked', async () => {
        await connect();
        const openChangeListener = createOpenChangeListener(element);
        element.toggleButton!.control.click();
        expect(element.open).toBeTrue();
        await openChangeListener.promise;
        expect(document.activeElement).toEqual(menuItem1);
    });

    it("should open the menu and focus first menu item when 'Enter' is pressed while the toggle button is focused", async () => {
        await connect();
        const openChangeListener = createOpenChangeListener(element);
        const event = new KeyboardEvent('keypress', {
            key: keyEnter
        } as KeyboardEventInit);
        element.toggleButton!.control.dispatchEvent(event);
        expect(element.open).toBeTrue();
        await openChangeListener.promise;
        expect(document.activeElement).toEqual(menuItem1);
    });

    it("should open the menu and focus first menu item when 'Space' is pressed while the toggle button is focused", async () => {
        await connect();
        const openChangeListener = createOpenChangeListener(element);
        const event = new KeyboardEvent('keypress', {
            key: keySpace
        } as KeyboardEventInit);
        element.toggleButton!.control.dispatchEvent(event);
        expect(element.open).toBeTrue();
        await openChangeListener.promise;
        expect(document.activeElement).toEqual(menuItem1);
    });

    it('should open the menu and focus first menu item when the down arrow is pressed while the toggle button is focused', async () => {
        await connect();
        const openChangeListener = createOpenChangeListener(element);
        const event = new KeyboardEvent('keydown', {
            key: keyArrowDown
        } as KeyboardEventInit);
        element.toggleButton!.dispatchEvent(event);
        expect(element.open).toBeTrue();
        await openChangeListener.promise;
        expect(document.activeElement).toEqual(menuItem1);
    });

    it('should open the menu and focus last menu item when the up arrow is pressed while the toggle button is focused', async () => {
        await connect();
        const openChangeListener = createOpenChangeListener(element);
        const event = new KeyboardEvent('keydown', {
            key: keyArrowUp
        } as KeyboardEventInit);
        element.toggleButton!.dispatchEvent(event);
        expect(element.open).toBeTrue();
        await openChangeListener.promise;
        expect(document.activeElement).toEqual(menuItem3);
    });

    it("should close the menu when pressing 'Escape'", async () => {
        element.open = true;
        await connect();
        const event = new KeyboardEvent('keydown', {
            key: keyEscape
        } as KeyboardEventInit);
        element.region!.dispatchEvent(event);
        expect(element.open).toBeFalse();
    });

    it("should focus the button when the menu is closed by pressing 'Escape'", async () => {
        element.open = true;
        await connect();
        const event = new KeyboardEvent('keydown', {
            key: keyEscape
        } as KeyboardEventInit);
        element.region!.dispatchEvent(event);
        expect(document.activeElement).toEqual(element);
    });

    it('should close the menu when selecting a menu item by clicking it', async () => {
        element.open = true;
        await connect();
        menuItem1.click();
        expect(element.open).toBeFalse();
    });

    it('should focus the button when the menu is closed by selecting a menu item by clicking it', async () => {
        element.open = true;
        await connect();
        menuItem1.click();
        expect(document.activeElement).toEqual(element);
    });

    it("should close the menu when selecting a menu item using 'Enter'", async () => {
        element.open = true;
        await connect();
        const event = new KeyboardEvent('keydown', {
            key: keyEnter
        } as KeyboardEventInit);
        menuItem1.dispatchEvent(event);
        expect(element.open).toBeFalse();
    });

    it("should focus the button when the menu is closed by selecting a menu item using 'Enter'", async () => {
        element.open = true;
        await connect();
        const event = new KeyboardEvent('keydown', {
            key: keyEnter
        } as KeyboardEventInit);
        menuItem1.dispatchEvent(event);
        expect(document.activeElement).toEqual(element);
    });

    it("should focus the button before bubbling 'change' event on a menu item", async () => {
        let menuItemChangeEventHandled = false;
        const onMenuItemChange = (): void => {
            expect(document.activeElement).toEqual(element);
            menuItemChangeEventHandled = true;
        };

        element.open = true;
        await connect();
        menuItem1.addEventListener(eventChange, onMenuItemChange);
        menuItem1.click();
        expect(menuItemChangeEventHandled).toBeTrue();
        menuItem1.removeEventListener(eventChange, onMenuItemChange);
    });

    it('should not close the menu when clicking on a disabled menu item', async () => {
        element.open = true;
        await connect();
        menuItem1.disabled = true;
        menuItem1.click();
        expect(element.open).toBeTrue();
    });

    it('should close the menu when the element loses focus', async () => {
        const focusableElement = document.createElement('input');
        parent.appendChild(focusableElement);
        await connect();
        // Start with the focus on the menu button so that it can lose focus later
        element.focus();
        element.open = true;
        focusableElement.focus();
        expect(element.open).toBeFalse();
    });

    it('anchored-region should not exist in DOM when the menu is closed', async () => {
        await connect();
        expect(
            element.shadowRoot?.querySelector('nimble-anchored-region')
        ).toBeNull();
    });

    it('anchored-region should exist in DOM when the menu is open', async () => {
        element.open = true;
        await connect();
        expect(
            element.shadowRoot?.querySelector('nimble-anchored-region')
        ).not.toBeNull();
    });

    it("anchored-region should be configured correctly when the menu button position is configured to 'above'", async () => {
        element.open = true;
        element.position = MenuButtonPosition.above;
        await connect();
        expect(element.region!.verticalPositioningMode).toBe('locktodefault');
        expect(element.region!.verticalDefaultPosition).toBe('top');
    });

    it("anchored-region should be configured correctly when the menu button position is configured to 'below'", async () => {
        element.open = true;
        element.position = MenuButtonPosition.below;
        await connect();
        expect(element.region!.verticalPositioningMode).toBe('locktodefault');
        expect(element.region!.verticalDefaultPosition).toBe('bottom');
    });

    it("anchored-region should be configured correctly when the menu button position is configured to 'auto'", async () => {
        element.open = true;
        element.position = MenuButtonPosition.auto;
        await connect();
        expect(element.region!.verticalPositioningMode).toBe('dynamic');
    });

    it("should fire 'openChanged' event when the menu is opened", async () => {
        await connect();
        const openChangeListener = createOpenChangeListener(element);
        element.open = true;
        await openChangeListener.promise;
        expect(openChangeListener.spy).toHaveBeenCalledTimes(1);
    });

    it("should fire 'openChanged' event when the menu is closed", async () => {
        element.open = true;
        await connect();
        const openChangeListener = createOpenChangeListener(element);
        element.open = false;
        await openChangeListener.promise;
        expect(openChangeListener.spy).toHaveBeenCalledTimes(1);
    });

    it("should fire 'beforetoggle' event before the menu opens", async () => {
        await connect();
        const openChangeListener = createOpenChangeListener(element);
        const beforeToggleListener = createBeforeToggleListener(element, false, openChangeListener.spy);
        const expectedDetails: MenuButtonBeforeToggleEventDetail = {
            newState: true,
            oldState: false
        };

        element.toggleButton!.control.click();
        await beforeToggleListener.promise;
        expect(beforeToggleListener.spy).toHaveBeenCalledTimes(1);
        const event = beforeToggleListener.spy.calls.first().args[0] as CustomEvent;
        expect(event.detail).toEqual(expectedDetails);
        beforeToggleListener.spy.calls.reset();

        await openChangeListener.promise;
        expect(beforeToggleListener.spy).not.toHaveBeenCalled();
        expect(openChangeListener.spy).toHaveBeenCalledTimes(1);
    });

    it("should fire 'beforetoggle' event before the menu is closed", async () => {
        element.open = true;
        await connect();
        const openChangeListener = createOpenChangeListener(element);
        const beforeToggleListener = createBeforeToggleListener(element, true, openChangeListener.spy);
        const expectedDetails: MenuButtonBeforeToggleEventDetail = {
            newState: false,
            oldState: true
        };

        element.toggleButton!.control.click();
        await beforeToggleListener.promise;
        expect(beforeToggleListener.spy).toHaveBeenCalledTimes(1);
        const event = beforeToggleListener.spy.calls.first().args[0] as CustomEvent;
        expect(event.detail).toEqual(expectedDetails);
        beforeToggleListener.spy.calls.reset();

        await openChangeListener.promise;
        expect(beforeToggleListener.spy).not.toHaveBeenCalled();
        expect(openChangeListener.spy).toHaveBeenCalledTimes(1);
    });

    it('should not interact with form', async () => {
        element.setAttribute('name', 'test');
        element.open = true;
        const form = document.createElement('form');
        form.appendChild(element);
        parent.appendChild(form);

        await connect();

        const formData = new FormData(form);
        expect(formData.has('test')).toBeFalse();
    });
});
