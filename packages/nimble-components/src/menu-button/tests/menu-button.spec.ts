import { html } from '@ni/fast-element';
import { eventChange, keyEnter } from '@ni/fast-web-utilities';
import { FoundationElement } from '@ni/fast-foundation';
import { parameterizeSuite } from '@ni/jasmine-parameterized';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { menuTag, type Menu } from '../../menu';
import { menuItemTag, type MenuItem } from '../../menu-item';
import { MenuButton, menuButtonTag } from '..';
import { type MenuButtonToggleEventDetail, MenuButtonPosition } from '../types';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { waitForEvent } from '../../utilities/testing/component';
import { MenuButtonPageObject } from '../testing/menu-button.pageobject';

type MenuButtonToggleEventHandler = (
    evt: CustomEvent<MenuButtonToggleEventDetail>
) => void;

class TestSlottedElement extends FoundationElement {}
const composedTestSlottedElement = TestSlottedElement.compose({
    baseName: 'test-slotted-element',
    template: html`
        <${menuButtonTag}>
            <slot slot="menu" name="menu"></slot>
        </${menuButtonTag}>
    `
});

async function setup(): Promise<Fixture<MenuButton>> {
    return await fixture<MenuButton>(
        html`<${menuButtonTag}></${menuButtonTag}>`
    );
}

async function slottedSetup(): Promise<Fixture<TestSlottedElement>> {
    return await fixture(composedTestSlottedElement());
}

describe('MenuButton', () => {
    const menuGap = 4;

    let parent: HTMLElement;
    let menu: Menu;
    let menuItem1: MenuItem;
    let menuItem2: MenuItem;
    let menuItem3: MenuItem;

    function createAndSlotMenu(parentElement: HTMLElement): void {
        menu = document.createElement(menuTag);
        menu.slot = 'menu';

        menuItem1 = document.createElement(menuItemTag);
        menuItem1.textContent = 'menu item 1';
        menu.appendChild(menuItem1);

        menuItem2 = document.createElement(menuItemTag);
        menuItem2.textContent = 'menu item 2';
        menu.appendChild(menuItem2);

        menuItem3 = document.createElement(menuItemTag);
        menuItem3.textContent = 'menu item 3';
        menu.appendChild(menuItem3);

        parentElement.appendChild(menu);
    }

    describe('basic functionality', () => {
        let element: MenuButton;
        let pageObject: MenuButtonPageObject;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        beforeEach(async () => {
            ({ element, connect, disconnect, parent } = await setup());
            createAndSlotMenu(element);
            pageObject = new MenuButtonPageObject(element);
        });

        afterEach(async () => {
            await disconnect();
        });

        it('can construct an element instance', () => {
            expect(document.createElement(menuButtonTag)).toBeInstanceOf(
                MenuButton
            );
        });

        it('should disable the toggle button when the disabled is `true`', async () => {
            element.disabled = true;
            await connect();
            expect(element.toggleButton!.disabled).toBeTrue();
        });

        it('should not set tabindex on the toggle button by default', async () => {
            await connect();
            expect(element.toggleButton!.getAttribute('tabindex')).toBeNull();
        });

        it('should set tabindex on the toggle button when provided', async () => {
            element.setAttribute('tabindex', '-1');
            await connect();
            expect(element.toggleButton!.getAttribute('tabindex')).toEqual(
                '-1'
            );
        });

        it('should clear tabindex from the toggle button when cleared from the host', async () => {
            element.setAttribute('tabindex', '-1');
            await connect();
            element.removeAttribute('tabindex');
            await waitForUpdatesAsync();
            expect(element.toggleButton!.getAttribute('tabindex')).toBeNull();
        });

        it('should set aria-haspopup on toggle button', async () => {
            await connect();
            expect(element.toggleButton!.getAttribute('aria-haspopup')).toEqual(
                'true'
            );
        });

        it('should set aria-expanded to true on the toggle button when the menu is open', async () => {
            await connect();
            await pageObject.openMenu();
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

        it('should mark the toggle button as checked when the menu is opened after connect', async () => {
            await connect();
            await pageObject.openMenu();
            expect(element.toggleButton!.checked).toBeTrue();
        });

        it('should not mark the toggle button as checked when the menu is not open', async () => {
            await connect();
            expect(element.toggleButton!.checked).toBeFalse();
        });

        it("should default 'isOpen' to false", async () => {
            await connect();
            expect(element.isOpen).toBeFalse();
        });

        it('should not open menu when the toggle button is clicked if the element is disabled', async () => {
            element.disabled = true;
            await connect();
            pageObject.clickMenuButton();
            expect(element.isOpen).toBeFalse();
        });

        it('should close menu when toggle button is clicked while the menu is open', async () => {
            await connect();
            await pageObject.openMenu();
            pageObject.clickMenuButton();
            expect(element.isOpen).toBeFalse();
        });

        it('should not interact with form', async () => {
            element.setAttribute('name', 'test');
            const form = document.createElement('form');
            form.appendChild(element);
            parent.appendChild(form);

            await connect();
            await pageObject.openMenu();

            const formData = new FormData(form);
            expect(formData.has('test')).toBeFalse();
        });

        it('should keep the menu slot in a closed popover', async () => {
            await connect();
            expect(element.popoverElement!.popover).toBe('auto');
            expect(element.popoverElement!.matches(':popover-open')).toBeFalse();
            expect(element.slottedMenus).toEqual([menu]);
            expect(menu.getBoundingClientRect().height).toBe(0);
        });

        it('should open the popover imperatively', async () => {
            await connect();
            element.open();
            await waitForUpdatesAsync();
            expect(element.isOpen).toBeTrue();
            expect(element.popoverElement!.matches(':popover-open')).toBeTrue();
            expect(element.hasAttribute('open')).toBeFalse();
        });

        it('should synchronize state and emit events when the popover is dismissed natively', async () => {
            await connect();
            await pageObject.openMenu();
            const beforeToggleSpy = jasmine.createSpy<MenuButtonToggleEventHandler>();
            const toggleSpy = jasmine.createSpy<MenuButtonToggleEventHandler>();
            const beforeTogglePromise = waitForEvent(element, 'beforetoggle', beforeToggleSpy);
            const togglePromise = waitForEvent(element, 'toggle', toggleSpy);

            element.popoverElement!.hidePopover();
            await Promise.all([beforeTogglePromise, togglePromise]);
            await waitForUpdatesAsync();

            expect(element.isOpen).toBeFalse();
            expect(element.hasAttribute('open')).toBeFalse();
            expect(element.toggleButton!.checked).toBeFalse();
            expect(element.toggleButton!.getAttribute('aria-expanded')).toBe('false');
            const expectedDetails = { oldState: true, newState: false };
            expect(beforeToggleSpy).toHaveBeenCalledTimes(1);
            expect(beforeToggleSpy.calls.first().args[0].detail).toEqual(expectedDetails);
            expect(toggleSpy).toHaveBeenCalledTimes(1);
            expect(toggleSpy.calls.first().args[0].detail).toEqual(expectedDetails);
        });

        it('should not open the popover when the removed open attribute is set', async () => {
            await connect();
            element.setAttribute('open', '');
            await waitForUpdatesAsync();
            expect(element.isOpen).toBeFalse();
            element.removeAttribute('open');
            expect(element.popoverElement!.matches(':popover-open')).toBeFalse();
        });

        it('should stay closed when native light-dismiss precedes a toggle button click', async () => {
            await connect();
            await pageObject.openMenu();

            element.popoverElement!.hidePopover();
            element.toggleButton!.control.click();
            await waitForUpdatesAsync();

            expect(element.isOpen).toBeFalse();
            expect(element.toggleButton!.checked).toBeFalse();
            expect(element.popoverElement!.matches(':popover-open')).toBeFalse();
        });

        it('should remain closed after reconnecting until opened again', async () => {
            await connect();
            await pageObject.openMenu();
            await disconnect();
            expect(element.isOpen).toBeFalse();
            await connect();
            await waitForUpdatesAsync();
            expect(element.isOpen).toBeFalse();
            await pageObject.openMenu();
            expect(element.isOpen).toBeTrue();
            expect(element.popoverElement!.matches(':popover-open')).toBeTrue();
            await waitForUpdatesAsync();
            menuItem1.click();
            expect(element.isOpen).toBeFalse();
        });

        const positioningConfigurations = [
            { name: 'auto below', position: MenuButtonPosition.auto, top: 100, above: false },
            { name: 'auto above near viewport bottom', position: MenuButtonPosition.auto, top: window.innerHeight - 40, above: true },
            { name: 'forced above', position: MenuButtonPosition.above, top: 200, above: true },
            { name: 'forced above near viewport top', position: MenuButtonPosition.above, top: 0, above: true },
            { name: 'forced below near viewport bottom', position: MenuButtonPosition.below, top: window.innerHeight - 40, above: false }
        ] as const;
        parameterizeSuite(positioningConfigurations, (suite, name, value) => {
            suite(name, () => {
                it('should position the menu relative to the toggle button', async () => {
                    parent.style.top = `${value.top}px`;
                    parent.style.left = '100px';
                    parent.style.position = 'fixed';
                    element.position = value.position;
                    await connect();
                    await pageObject.openMenu();
                    const buttonBounds = element.toggleButton!.getBoundingClientRect();
                    const popupBounds = element.popoverElement!.getBoundingClientRect();
                    expect(popupBounds.height).toBeGreaterThan(0);
                    expect(popupBounds.left).toBeCloseTo(buttonBounds.left, 0);
                    if (value.above) {
                        expect(popupBounds.bottom).toBeCloseTo(buttonBounds.top - menuGap, 0);
                    } else {
                        expect(popupBounds.top).toBeCloseTo(buttonBounds.bottom + menuGap, 0);
                    }
                });
            });
        });

        it('should flip horizontally to keep the menu within the viewport', async () => {
            parent.style.left = 'auto';
            parent.style.right = '0';
            await connect();
            await pageObject.openMenu();
            const buttonBounds = element.toggleButton!.getBoundingClientRect();
            const popupBounds = element.popoverElement!.getBoundingClientRect();
            expect(popupBounds.right).toBeCloseTo(buttonBounds.right, 0);
            expect(popupBounds.left).toBeGreaterThanOrEqual(0);
        });

        it('should close the popover imperatively before the opening toggle event', async () => {
            await connect();
            element.open();
            element.close();
            await waitForUpdatesAsync();
            expect(element.popoverElement!.matches(':popover-open')).toBeFalse();
            expect(element.toggleButton!.checked).toBeFalse();
        });

        it('should cancel a pending click-driven opening when closed imperatively', async () => {
            await connect();
            pageObject.clickMenuButton();
            element.close();
            await waitForUpdatesAsync();
            expect(element.isOpen).toBeFalse();
            expect(element.toggleButton!.checked).toBeFalse();
        });

        it('should emit beforetoggle once for repeated open calls', async () => {
            await connect();
            const spy = jasmine.createSpy();
            element.addEventListener('beforetoggle', spy);
            const togglePromise = waitForEvent(element, 'toggle');
            element.open();
            element.open();
            await togglePromise;
            element.open();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(element.isOpen).toBeTrue();
        });

        it('should not emit toggle events when closing an already closed menu', async () => {
            await connect();
            const spy = jasmine.createSpy();
            element.addEventListener('beforetoggle', spy);
            element.addEventListener('toggle', spy);
            element.close();
            await waitForUpdatesAsync();
            expect(spy).not.toHaveBeenCalled();
            expect(element.isOpen).toBeFalse();
        });

        it('should cancel a queued opening when disconnected', async () => {
            await connect();
            element.open();
            await disconnect();
            await connect();
            await waitForUpdatesAsync();
            expect(element.isOpen).toBeFalse();
            expect(element.toggleButton!.checked).toBeFalse();

            await pageObject.openMenu();
            expect(element.isOpen).toBeTrue();
            expect(document.activeElement).toBe(menuItem1);
        });

        it('should report the native popover state rather than a pending opening', async () => {
            await connect();
            const togglePromise = waitForEvent(element, 'toggle');
            element.open();
            expect(element.isOpen).toBeFalse();
            await togglePromise;
            expect(element.isOpen).toBeTrue();
            element.close();
            expect(element.isOpen).toBeFalse();
        });

        it('should reopen imperatively before the closing checked-state update', async () => {
            await connect();
            await pageObject.openMenu();
            const closed = waitForEvent(element, 'toggle');
            menuItem1.click();
            element.open();
            await closed;
            await waitForEvent(element, 'toggle');
            expect(element.isOpen).toBeTrue();
            expect(element.toggleButton!.checked).toBeTrue();
        });

        it('should update positioning while the popover is open', async () => {
            parent.style.top = '200px';
            await connect();
            await pageObject.openMenu();
            element.position = MenuButtonPosition.above;
            await waitForUpdatesAsync();
            const buttonBounds = element.toggleButton!.getBoundingClientRect();
            const popupBounds = element.popoverElement!.getBoundingClientRect();
            expect(popupBounds.bottom).toBeCloseTo(buttonBounds.top - menuGap, 0);
        });

        it("should fire 'toggle' event when the menu is opened", async () => {
            await connect();
            const spy = jasmine.createSpy<MenuButtonToggleEventHandler>();
            const toggleListener = waitForEvent(element, 'toggle', spy);
            element.open();
            await toggleListener;
            expect(spy).toHaveBeenCalledTimes(1);
            const expectedDetails: MenuButtonToggleEventDetail = {
                newState: true,
                oldState: false
            };
            const event = spy.calls.first().args[0];
            expect(event.detail).toEqual(expectedDetails);
        });

        it('should report the closed native state during the closing toggle event', async () => {
            await connect();
            await pageObject.openMenu();
            const togglePromise = waitForEvent(element, 'toggle', () => {
                expect(element.isOpen).toBeFalse();
                expect(element.toggleButton!.checked).toBeFalse();
            });
            element.close();
            await togglePromise;
        });

        it("should fire 'toggle' event when the menu is closed", async () => {
            await connect();
            await pageObject.openMenu();
            const spy = jasmine.createSpy<MenuButtonToggleEventHandler>();
            const toggleListener = waitForEvent(element, 'toggle', spy);
            element.close();
            await toggleListener;
            expect(spy).toHaveBeenCalledTimes(1);
            const expectedDetails: MenuButtonToggleEventDetail = {
                newState: false,
                oldState: true
            };
            const event = spy.calls.first().args[0];
            expect(event.detail).toEqual(expectedDetails);
        });

        it("should fire 'beforetoggle' event before the menu opens", async () => {
            await connect();
            const spy = jasmine.createSpy<MenuButtonToggleEventHandler>();
            const beforeTogglePromise = waitForEvent(
                element,
                'beforetoggle',
                spy
            );
            const togglePromise = waitForEvent(element, 'toggle', spy);

            expect(element.isOpen).toEqual(false);
            expect(spy).not.toHaveBeenCalled();

            pageObject.clickMenuButton();
            await Promise.all([togglePromise, beforeTogglePromise]);

            const expectedDetails: MenuButtonToggleEventDetail = {
                newState: true,
                oldState: false
            };
            expect(spy).toHaveBeenCalledTimes(2);
            const beforetoggleEvent = spy.calls.argsFor(0)[0];
            expect(beforetoggleEvent.type).toEqual('beforetoggle');
            expect(beforetoggleEvent.detail).toEqual(expectedDetails);
            const toggleEvent = spy.calls.argsFor(1)[0];
            expect(toggleEvent.type).toEqual('toggle');
            expect(toggleEvent.detail).toEqual(expectedDetails);
        });

        it("should fire 'beforetoggle' event before the menu is closed", async () => {
            await connect();
            await pageObject.openMenu();
            const spy = jasmine.createSpy<MenuButtonToggleEventHandler>();
            const beforeTogglePromise = waitForEvent(
                element,
                'beforetoggle',
                spy
            );
            const togglePromise = waitForEvent(element, 'toggle', spy);

            expect(element.isOpen).toEqual(true);
            expect(spy).not.toHaveBeenCalled();

            pageObject.clickMenuButton();
            await Promise.all([togglePromise, beforeTogglePromise]);

            const expectedDetails: MenuButtonToggleEventDetail = {
                newState: false,
                oldState: true
            };
            expect(spy).toHaveBeenCalledTimes(2);
            const beforetoggleEvent = spy.calls.argsFor(0)[0];
            expect(beforetoggleEvent.type).toEqual('beforetoggle');
            expect(beforetoggleEvent.detail).toEqual(expectedDetails);
            const toggleEvent = spy.calls.argsFor(1)[0];
            expect(toggleEvent.type).toEqual('toggle');
            expect(toggleEvent.detail).toEqual(expectedDetails);
        });
    });

    const menuSlotConfigurations = [
        {
            name: 'menu slotted directly in menu-button',
            setupFunction: setup,
            getMenuButton: (element: HTMLElement) => element as MenuButton
        },
        {
            name: 'menu passed through slot of additional element',
            setupFunction: slottedSetup,
            getMenuButton: (element: HTMLElement) => element.shadowRoot!.querySelector(menuButtonTag)!
        }
    ] as const;
    parameterizeSuite(menuSlotConfigurations, (suite, name, value) => {
        suite(`menu interaction with ${name}`, () => {
            let element: HTMLElement;
            let pageObject: MenuButtonPageObject;
            let menuButton: MenuButton;
            let connect: () => Promise<void>;
            let disconnect: () => Promise<void>;

            beforeEach(async () => {
                ({ element, connect, disconnect, parent } = await value.setupFunction());
                createAndSlotMenu(element);
                await connect();
                menuButton = value.getMenuButton(element);
                pageObject = new MenuButtonPageObject(menuButton);
            });

            afterEach(async () => {
                await disconnect();
            });

            it('should open the menu and focus first menu item when the toggle button is clicked', async () => {
                const toggleListener = waitForEvent(menuButton, 'toggle');
                pageObject.clickMenuButton();
                await toggleListener;
                expect(menuButton.isOpen).toBeTrue();
                expect(document.activeElement).toEqual(menuItem1);
            });

            it("should open the menu and focus first menu item when 'Enter' is pressed while the toggle button is focused", async () => {
                const toggleListener = waitForEvent(menuButton, 'toggle');
                pageObject.pressEnterKey();
                await toggleListener;
                expect(menuButton.isOpen).toBeTrue();
                expect(document.activeElement).toEqual(menuItem1);
            });

            it("should open the menu and focus first menu item when 'Space' is pressed while the toggle button is focused", async () => {
                const toggleListener = waitForEvent(menuButton, 'toggle');
                pageObject.pressSpaceKey();
                await toggleListener;
                expect(menuButton.isOpen).toBeTrue();
                expect(document.activeElement).toEqual(menuItem1);
            });

            it('should open the menu and focus first menu item when the down arrow is pressed while the toggle button is focused', async () => {
                const toggleListener = waitForEvent(menuButton, 'toggle');
                pageObject.pressArrowDownKey();
                await toggleListener;
                expect(menuButton.isOpen).toBeTrue();
                expect(document.activeElement).toEqual(menuItem1);
            });

            it('should open the menu and focus last menu item when the up arrow is pressed while the toggle button is focused', async () => {
                const toggleListener = waitForEvent(menuButton, 'toggle');
                pageObject.pressArrowUpKey();
                await toggleListener;
                expect(menuButton.isOpen).toBeTrue();
                expect(document.activeElement).toEqual(menuItem3);
            });

            it("should close the menu when pressing 'Escape'", async () => {
                await pageObject.openMenu();

                pageObject.closeMenuWithEscape();
                expect(menuButton.isOpen).toBeFalse();
            });

            it("should focus the button when the menu is closed by pressing 'Escape'", async () => {
                await pageObject.openMenu();

                pageObject.closeMenuWithEscape();
                expect(document.activeElement).toEqual(element);
            });

            it('should close the menu when selecting a menu item by clicking it', async () => {
                await pageObject.openMenu();

                menuItem1.click();
                expect(menuButton.isOpen).toBeFalse();
            });

            it('should focus the button when the menu is closed by selecting a menu item by clicking it', async () => {
                await pageObject.openMenu();

                menuItem1.click();
                expect(document.activeElement).toEqual(element);
            });

            it("should close the menu when selecting a menu item using 'Enter'", async () => {
                await pageObject.openMenu();

                const event = new KeyboardEvent('keydown', {
                    key: keyEnter
                });
                menuItem1.dispatchEvent(event);
                expect(menuButton.isOpen).toBeFalse();
            });

            it("should focus the button when the menu is closed by selecting a menu item using 'Enter'", async () => {
                await pageObject.openMenu();

                const event = new KeyboardEvent('keydown', {
                    key: keyEnter
                });
                menuItem1.dispatchEvent(event);
                expect(document.activeElement).toEqual(element);
            });

            it("should focus the button before bubbling 'change' event on a menu item", async () => {
                let menuItemChangeEventHandled = false;
                const onMenuItemChange = (): void => {
                    expect(document.activeElement).toEqual(element);
                    menuItemChangeEventHandled = true;
                };
                await pageObject.openMenu();

                menuItem1.addEventListener(eventChange, onMenuItemChange);
                menuItem1.click();
                expect(menuItemChangeEventHandled).toBeTrue();
                menuItem1.removeEventListener(eventChange, onMenuItemChange);
            });

            it('should not close the menu when clicking on a disabled menu item', async () => {
                await pageObject.openMenu();

                menuItem1.disabled = true;
                menuItem1.click();
                expect(menuButton.isOpen).toBeTrue();
            });

            it('should close the menu when the element loses focus', async () => {
                const focusableElement = document.createElement('input');
                parent.appendChild(focusableElement);

                // Start with the focus on the menu button so that it can lose focus later
                menuButton.focus();
                menuButton.open();
                await waitForUpdatesAsync();
                focusableElement.focus();
                await waitForUpdatesAsync();
                expect(menuButton.isOpen).toBeFalse();
            });
        });
    });

    parameterizeSuite(menuSlotConfigurations, (suite, name, value) => {
        suite(`menu interaction without a ${name}`, () => {
            let element: HTMLElement;
            let menuButton: MenuButton;
            let pageObject: MenuButtonPageObject;
            let connect: () => Promise<void>;
            let disconnect: () => Promise<void>;

            beforeEach(async () => {
                ({ element, connect, disconnect, parent } = await value.setupFunction());
                // Unlike other tests, explicitly do not slot a menu in the parent element
                await connect();
                menuButton = value.getMenuButton(element);
                pageObject = new MenuButtonPageObject(menuButton);
            });

            afterEach(async () => {
                await disconnect();
            });

            it('should transition to the open state when the toggle button is clicked', async () => {
                const spy = jasmine.createSpy<MenuButtonToggleEventHandler>();
                const toggleListener = waitForEvent(menuButton, 'toggle', spy);
                pageObject.clickMenuButton();
                await toggleListener;
                expect(menuButton.isOpen).toBeTrue();
                expect(spy).toHaveBeenCalledTimes(1);
                const expectedDetails: MenuButtonToggleEventDetail = {
                    newState: true,
                    oldState: false
                };
                const event = spy.calls.first().args[0];
                expect(event.detail).toEqual(expectedDetails);
            });

            it("should transition to the open state when 'Enter' is pressed while the toggle button is focused", async () => {
                const spy = jasmine.createSpy<MenuButtonToggleEventHandler>();
                const toggleListener = waitForEvent(menuButton, 'toggle', spy);
                pageObject.pressEnterKey();
                await toggleListener;
                expect(menuButton.isOpen).toBeTrue();
                expect(spy).toHaveBeenCalledTimes(1);
                const expectedDetails: MenuButtonToggleEventDetail = {
                    newState: true,
                    oldState: false
                };
                const toggleEvent = spy.calls.first().args[0];
                expect(toggleEvent.detail).toEqual(expectedDetails);
            });

            it("should transition to the open state when 'Space' is pressed while the toggle button is focused", async () => {
                const spy = jasmine.createSpy<MenuButtonToggleEventHandler>();
                const toggleListener = waitForEvent(menuButton, 'toggle', spy);
                pageObject.pressSpaceKey();
                await toggleListener;
                expect(menuButton.isOpen).toBeTrue();
                expect(spy).toHaveBeenCalledTimes(1);
                const expectedDetails: MenuButtonToggleEventDetail = {
                    newState: true,
                    oldState: false
                };
                const toggleEvent = spy.calls.first().args[0];
                expect(toggleEvent.detail).toEqual(expectedDetails);
            });

            it('should transition to the open state when the down arrow is pressed while the toggle button is focused', async () => {
                const spy = jasmine.createSpy<MenuButtonToggleEventHandler>();
                const toggleListener = waitForEvent(menuButton, 'toggle', spy);
                pageObject.pressArrowDownKey();
                await toggleListener;
                expect(menuButton.isOpen).toBeTrue();
                expect(spy).toHaveBeenCalledTimes(1);
                const expectedDetails: MenuButtonToggleEventDetail = {
                    newState: true,
                    oldState: false
                };
                const toggleEvent = spy.calls.first().args[0];
                expect(toggleEvent.detail).toEqual(expectedDetails);
            });

            it('should transition to the open state when the up arrow is pressed while the toggle button is focused', async () => {
                const spy = jasmine.createSpy<MenuButtonToggleEventHandler>();
                const toggleListener = waitForEvent(menuButton, 'toggle', spy);
                pageObject.pressArrowUpKey();
                await toggleListener;
                expect(menuButton.isOpen).toBeTrue();
                expect(spy).toHaveBeenCalledTimes(1);
                const expectedDetails: MenuButtonToggleEventDetail = {
                    newState: true,
                    oldState: false
                };
                const toggleEvent = spy.calls.first().args[0];
                expect(toggleEvent.detail).toEqual(expectedDetails);
            });

            it("should transition to the closed state when pressing 'Escape'", async () => {
                await pageObject.openMenu();

                pageObject.closeMenuWithEscape();
                expect(menuButton.isOpen).toBeFalse();
            });

            it("should focus the button when moving to the closed state by pressing 'Escape'", async () => {
                await pageObject.openMenu();

                pageObject.closeMenuWithEscape();
                expect(document.activeElement).toEqual(element);
            });
        });
    });
});
