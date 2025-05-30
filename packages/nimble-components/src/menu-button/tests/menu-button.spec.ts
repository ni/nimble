import { html } from '@ni/fast-element';
import { eventChange, keyEnter } from '@ni/fast-web-utilities';
import { FoundationElement } from '@ni/fast-foundation';
import { parameterizeSuite } from '@ni/jasmine-parameterized';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { menuTag, type Menu } from '../../menu';
import { menuItemTag, type MenuItem } from '../../menu-item';
import { MenuButton, menuButtonTag } from '..';
import { type MenuButtonToggleEventDetail, MenuButtonPosition } from '../types';
import {
    processUpdates,
    waitForUpdatesAsync
} from '../../testing/async-helpers';
import { waitForEvent } from '../../utilities/testing/component';
import { MenuButtonPageObject } from '../testing/menu-button.pageobject';
import { anchoredRegionTag } from '../../anchored-region';

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
            processUpdates();
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
            pageObject.clickMenuButton();
            expect(element.open).toBeFalse();
        });

        it('should close menu when toggle button is clicked while the menu is open', async () => {
            element.open = true;
            await connect();
            pageObject.clickMenuButton();
            expect(element.open).toBeFalse();
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

        it('anchored-region should not exist in DOM when the menu is closed', async () => {
            await connect();
            expect(
                element.shadowRoot?.querySelector(anchoredRegionTag)
            ).toBeNull();
        });

        it('anchored-region should exist in DOM when the menu is open', async () => {
            element.open = true;
            await connect();
            expect(
                element.shadowRoot?.querySelector(anchoredRegionTag)
            ).not.toBeNull();
        });

        it("anchored-region should be configured correctly when the menu button position is configured to 'above'", async () => {
            element.open = true;
            element.position = MenuButtonPosition.above;
            await connect();
            expect(element.region!.verticalPositioningMode).toBe(
                'locktodefault'
            );
            expect(element.region!.verticalDefaultPosition).toBe('top');
        });

        it("anchored-region should be configured correctly when the menu button position is configured to 'below'", async () => {
            element.open = true;
            element.position = MenuButtonPosition.below;
            await connect();
            expect(element.region!.verticalPositioningMode).toBe(
                'locktodefault'
            );
            expect(element.region!.verticalDefaultPosition).toBe('bottom');
        });

        it("anchored-region should be configured correctly when the menu button position is configured to 'auto'", async () => {
            element.open = true;
            element.position = MenuButtonPosition.auto;
            await connect();
            expect(element.region!.verticalPositioningMode).toBe('dynamic');
        });

        it("should fire 'toggle' event when the menu is opened", async () => {
            await connect();
            const spy = jasmine.createSpy<MenuButtonToggleEventHandler>();
            const toggleListener = waitForEvent(element, 'toggle', spy);
            element.open = true;
            await toggleListener;
            expect(spy).toHaveBeenCalledTimes(1);
            const expectedDetails: MenuButtonToggleEventDetail = {
                newState: true,
                oldState: false
            };
            const event = spy.calls.first().args[0];
            expect(event.detail).toEqual(expectedDetails);
        });

        it("should fire 'toggle' event when the menu is closed", async () => {
            element.open = true;
            await connect();
            const spy = jasmine.createSpy<MenuButtonToggleEventHandler>();
            const toggleListener = waitForEvent(element, 'toggle', spy);
            element.open = false;
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

            expect(element.open).toEqual(false);
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
            element.open = true;
            await connect();
            const spy = jasmine.createSpy<MenuButtonToggleEventHandler>();
            const beforeTogglePromise = waitForEvent(
                element,
                'beforetoggle',
                spy
            );
            const togglePromise = waitForEvent(element, 'toggle', spy);

            expect(element.open).toEqual(true);
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
                expect(menuButton.open).toBeTrue();
                await toggleListener;
                expect(document.activeElement).toEqual(menuItem1);
            });

            it("should open the menu and focus first menu item when 'Enter' is pressed while the toggle button is focused", async () => {
                const toggleListener = waitForEvent(menuButton, 'toggle');
                pageObject.pressEnterKey();
                expect(menuButton.open).toBeTrue();
                await toggleListener;
                expect(document.activeElement).toEqual(menuItem1);
            });

            it("should open the menu and focus first menu item when 'Space' is pressed while the toggle button is focused", async () => {
                const toggleListener = waitForEvent(menuButton, 'toggle');
                pageObject.pressSpaceKey();
                expect(menuButton.open).toBeTrue();
                await toggleListener;
                expect(document.activeElement).toEqual(menuItem1);
            });

            it('should open the menu and focus first menu item when the down arrow is pressed while the toggle button is focused', async () => {
                const toggleListener = waitForEvent(menuButton, 'toggle');
                pageObject.pressArrowDownKey();
                expect(menuButton.open).toBeTrue();
                await toggleListener;
                expect(document.activeElement).toEqual(menuItem1);
            });

            it('should open the menu and focus last menu item when the up arrow is pressed while the toggle button is focused', async () => {
                const toggleListener = waitForEvent(menuButton, 'toggle');
                pageObject.pressArrowUpKey();
                expect(menuButton.open).toBeTrue();
                await toggleListener;
                expect(document.activeElement).toEqual(menuItem3);
            });

            it("should close the menu when pressing 'Escape'", async () => {
                await pageObject.openMenu();

                pageObject.closeMenuWithEscape();
                expect(menuButton.open).toBeFalse();
            });

            it("should focus the button when the menu is closed by pressing 'Escape'", async () => {
                await pageObject.openMenu();

                pageObject.closeMenuWithEscape();
                expect(document.activeElement).toEqual(element);
            });

            it('should close the menu when selecting a menu item by clicking it', async () => {
                await pageObject.openMenu();

                menuItem1.click();
                expect(menuButton.open).toBeFalse();
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
                } as KeyboardEventInit);
                menuItem1.dispatchEvent(event);
                expect(menuButton.open).toBeFalse();
            });

            it("should focus the button when the menu is closed by selecting a menu item using 'Enter'", async () => {
                await pageObject.openMenu();

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
                expect(menuButton.open).toBeTrue();
            });

            it('should close the menu when the element loses focus', async () => {
                const focusableElement = document.createElement('input');
                parent.appendChild(focusableElement);

                // Start with the focus on the menu button so that it can lose focus later
                menuButton.focus();
                menuButton.open = true;
                await waitForUpdatesAsync();
                focusableElement.focus();
                await waitForUpdatesAsync();
                expect(menuButton.open).toBeFalse();
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
                expect(menuButton.open).toBeTrue();
                await toggleListener;
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
                expect(menuButton.open).toBeTrue();
                await toggleListener;
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
                expect(menuButton.open).toBeTrue();
                await toggleListener;
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
                expect(menuButton.open).toBeTrue();
                await toggleListener;
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
                expect(menuButton.open).toBeTrue();
                await toggleListener;
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
                expect(menuButton.open).toBeFalse();
            });

            it("should focus the button when moving to the closed state by pressing 'Escape'", async () => {
                await pageObject.openMenu();

                pageObject.closeMenuWithEscape();
                expect(document.activeElement).toEqual(element);
            });
        });
    });
});
