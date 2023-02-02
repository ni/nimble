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
import { MenuButtonToggleEventDetail, MenuButtonPosition } from '../types';

class TestSlottedElement extends FoundationElement {}
const composedTestSlottedElement = TestSlottedElement.compose({
    baseName: 'test-slotted-element',
    template: html`
        <nimble-menu-button>
            <slot slot="menu" name="menu"></slot>
        </nimble-menu-button>
    `
});

async function setup(): Promise<Fixture<MenuButton>> {
    return fixture<MenuButton>(html`<nimble-menu-button></nimble-menu-button>`);
}

async function slottedSetup(): Promise<Fixture<TestSlottedElement>> {
    return fixture(composedTestSlottedElement());
}

/** A helper function to abstract adding a `toggle` event listener, spying
 * on the event being called, and removing the event listener. The returned promise
 * should be resolved prior to completing a test.
 */
function createToggleListener(menuButton: MenuButton): {
    promise: Promise<void>,
    spy: jasmine.Spy
} {
    const spy = jasmine.createSpy();
    return {
        promise: new Promise(resolve => {
            const handler = (...args: unknown[]): void => {
                menuButton.removeEventListener('toggle', handler);
                spy(...args);
                resolve();
            };
            menuButton.addEventListener('toggle', handler);
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
 * `toggleSpy` has not been called.
 */
function createBeforeToggleListener(
    menuButton: MenuButton,
    expectedOpenState: boolean,
    toggleSpy: jasmine.Spy
): {
        promise: Promise<void>,
        spy: jasmine.Spy
    } {
    const spy = jasmine.createSpy();
    return {
        promise: new Promise(resolve => {
            const handler = (...args: unknown[]): void => {
                expect(menuButton.open).toEqual(expectedOpenState);
                expect(toggleSpy).not.toHaveBeenCalled();

                menuButton.removeEventListener('beforetoggle', handler);
                spy(...args);
                resolve();
            };
            menuButton.addEventListener('beforetoggle', handler);
        }),
        spy
    };
}

describe('MenuButton', () => {
    let parent: HTMLElement;
    let menu: Menu;
    let menuItem1: MenuItem;
    let menuItem2: MenuItem;
    let menuItem3: MenuItem;

    function createAndSlotMenu(parentElement: HTMLElement): void {
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

        parentElement.appendChild(menu);
    }

    describe('basic functionality', () => {
        let element: MenuButton;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        beforeEach(async () => {
            ({ element, connect, disconnect, parent } = await setup());
            createAndSlotMenu(element);
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
            const toggleListener = createToggleListener(element);
            element.open = true;
            await toggleListener.promise;
            expect(toggleListener.spy).toHaveBeenCalledTimes(1);
            const expectedDetails: MenuButtonToggleEventDetail = {
                newState: true,
                oldState: false
            };
            const event = toggleListener.spy.calls.first()
                .args[0] as CustomEvent;
            expect(event.detail).toEqual(expectedDetails);
        });

        it("should fire 'toggle' event when the menu is closed", async () => {
            element.open = true;
            await connect();
            const toggleListener = createToggleListener(element);
            element.open = false;
            await toggleListener.promise;
            expect(toggleListener.spy).toHaveBeenCalledTimes(1);
            const expectedDetails: MenuButtonToggleEventDetail = {
                newState: false,
                oldState: true
            };
            const event = toggleListener.spy.calls.first()
                .args[0] as CustomEvent;
            expect(event.detail).toEqual(expectedDetails);
        });

        it("should fire 'beforetoggle' event before the menu opens", async () => {
            await connect();
            const toggleListener = createToggleListener(element);
            const beforeToggleListener = createBeforeToggleListener(
                element,
                false,
                toggleListener.spy
            );
            const expectedDetails: MenuButtonToggleEventDetail = {
                newState: true,
                oldState: false
            };

            element.toggleButton!.control.click();
            await beforeToggleListener.promise;
            expect(beforeToggleListener.spy).toHaveBeenCalledTimes(1);
            const event = beforeToggleListener.spy.calls.first()
                .args[0] as CustomEvent;
            expect(event.detail).toEqual(expectedDetails);
            beforeToggleListener.spy.calls.reset();

            await toggleListener.promise;
            expect(beforeToggleListener.spy).not.toHaveBeenCalled();
            expect(toggleListener.spy).toHaveBeenCalledTimes(1);
        });

        it("should fire 'beforetoggle' event before the menu is closed", async () => {
            element.open = true;
            await connect();
            const toggleListener = createToggleListener(element);
            const beforeToggleListener = createBeforeToggleListener(
                element,
                true,
                toggleListener.spy
            );
            const expectedDetails: MenuButtonToggleEventDetail = {
                newState: false,
                oldState: true
            };

            element.toggleButton!.control.click();
            await beforeToggleListener.promise;
            expect(beforeToggleListener.spy).toHaveBeenCalledTimes(1);
            const event = beforeToggleListener.spy.calls.first()
                .args[0] as CustomEvent;
            expect(event.detail).toEqual(expectedDetails);
            beforeToggleListener.spy.calls.reset();

            await toggleListener.promise;
            expect(beforeToggleListener.spy).not.toHaveBeenCalled();
            expect(toggleListener.spy).toHaveBeenCalledTimes(1);
        });
    });

    interface MenuSlotConfiguration<T> {
        description: string;
        setupFunction: () => Promise<Fixture<T>>;
        getMenuButton: (element: HTMLElement) => MenuButton;
    }

    const menuSlotConfigurations: MenuSlotConfiguration<HTMLElement>[] = [
        {
            description: 'menu slotted directly in menu-button',
            setupFunction: setup,
            getMenuButton: (element: HTMLElement) => element as MenuButton
        },
        {
            description: 'menu passed through slot of additional element',
            setupFunction: slottedSetup,
            getMenuButton: (element: HTMLElement) => element.shadowRoot!.querySelector('nimble-menu-button')!
        }
    ];
    for (const configuration of menuSlotConfigurations) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        describe(`menu interaction with ${configuration.description}`, () => {
            let element: HTMLElement;
            let connect: () => Promise<void>;
            let disconnect: () => Promise<void>;

            async function openMenu(menuButton: MenuButton): Promise<void> {
                if (menuButton.open) {
                    return;
                }

                const toggleListener = createToggleListener(menuButton);
                menuButton.open = true;
                await toggleListener.promise;
            }

            beforeEach(async () => {
                ({ element, connect, disconnect, parent } = await configuration.setupFunction());
                createAndSlotMenu(element);
            });

            afterEach(async () => {
                await disconnect();
            });

            it('should open the menu and focus first menu item when the toggle button is clicked', async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                const toggleListener = createToggleListener(menuButton);
                menuButton.toggleButton!.control.click();
                expect(menuButton.open).toBeTrue();
                await toggleListener.promise;
                expect(document.activeElement).toEqual(menuItem1);
            });

            it("should open the menu and focus first menu item when 'Enter' is pressed while the toggle button is focused", async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                const toggleListener = createToggleListener(menuButton);
                const event = new KeyboardEvent('keypress', {
                    key: keyEnter
                } as KeyboardEventInit);
                menuButton.toggleButton!.control.dispatchEvent(event);
                expect(menuButton.open).toBeTrue();
                await toggleListener.promise;
                expect(document.activeElement).toEqual(menuItem1);
            });

            it("should open the menu and focus first menu item when 'Space' is pressed while the toggle button is focused", async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                const toggleListener = createToggleListener(menuButton);
                const event = new KeyboardEvent('keypress', {
                    key: keySpace
                } as KeyboardEventInit);
                menuButton.toggleButton!.control.dispatchEvent(event);
                expect(menuButton.open).toBeTrue();
                await toggleListener.promise;
                expect(document.activeElement).toEqual(menuItem1);
            });

            it('should open the menu and focus first menu item when the down arrow is pressed while the toggle button is focused', async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                const toggleListener = createToggleListener(menuButton);
                const event = new KeyboardEvent('keydown', {
                    key: keyArrowDown
                } as KeyboardEventInit);
                menuButton.toggleButton!.dispatchEvent(event);
                expect(menuButton.open).toBeTrue();
                await toggleListener.promise;
                expect(document.activeElement).toEqual(menuItem1);
            });

            it('should open the menu and focus last menu item when the up arrow is pressed while the toggle button is focused', async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                const toggleListener = createToggleListener(menuButton);
                const event = new KeyboardEvent('keydown', {
                    key: keyArrowUp
                } as KeyboardEventInit);
                menuButton.toggleButton!.dispatchEvent(event);
                expect(menuButton.open).toBeTrue();
                await toggleListener.promise;
                expect(document.activeElement).toEqual(menuItem3);
            });

            it("should close the menu when pressing 'Escape'", async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                await openMenu(menuButton);

                const event = new KeyboardEvent('keydown', {
                    key: keyEscape
                } as KeyboardEventInit);
                menuButton.region!.dispatchEvent(event);
                expect(menuButton.open).toBeFalse();
            });

            it("should focus the button when the menu is closed by pressing 'Escape'", async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                await openMenu(menuButton);

                const event = new KeyboardEvent('keydown', {
                    key: keyEscape
                } as KeyboardEventInit);
                menuButton.region!.dispatchEvent(event);
                expect(document.activeElement).toEqual(element);
            });

            it('should close the menu when selecting a menu item by clicking it', async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                await openMenu(menuButton);

                menuItem1.click();
                expect(menuButton.open).toBeFalse();
            });

            it('should focus the button when the menu is closed by selecting a menu item by clicking it', async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                await openMenu(menuButton);

                menuItem1.click();
                expect(document.activeElement).toEqual(element);
            });

            it("should close the menu when selecting a menu item using 'Enter'", async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                await openMenu(menuButton);

                const event = new KeyboardEvent('keydown', {
                    key: keyEnter
                } as KeyboardEventInit);
                menuItem1.dispatchEvent(event);
                expect(menuButton.open).toBeFalse();
            });

            it("should focus the button when the menu is closed by selecting a menu item using 'Enter'", async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                await openMenu(menuButton);

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

                await connect();
                const menuButton = configuration.getMenuButton(element);
                await openMenu(menuButton);

                menuItem1.addEventListener(eventChange, onMenuItemChange);
                menuItem1.click();
                expect(menuItemChangeEventHandled).toBeTrue();
                menuItem1.removeEventListener(eventChange, onMenuItemChange);
            });

            it('should not close the menu when clicking on a disabled menu item', async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                await openMenu(menuButton);

                menuItem1.disabled = true;
                menuItem1.click();
                expect(menuButton.open).toBeTrue();
            });

            it('should close the menu when the element loses focus', async () => {
                const focusableElement = document.createElement('input');
                parent.appendChild(focusableElement);
                await connect();
                const menuButton = configuration.getMenuButton(element);
                // Start with the focus on the menu button so that it can lose focus later
                menuButton.focus();
                menuButton.open = true;
                await DOM.nextUpdate();
                focusableElement.focus();
                await DOM.nextUpdate();
                expect(menuButton.open).toBeFalse();
            });
        });
    }

    for (const configuration of menuSlotConfigurations) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        describe(`menu interaction without a ${configuration.description}`, () => {
            let element: HTMLElement;
            let connect: () => Promise<void>;
            let disconnect: () => Promise<void>;

            async function openMenu(menuButton: MenuButton): Promise<void> {
                if (menuButton.open) {
                    return;
                }

                const toggleListener = createToggleListener(menuButton);
                menuButton.open = true;
                await toggleListener.promise;
            }

            beforeEach(async () => {
                ({ element, connect, disconnect, parent } = await configuration.setupFunction());
                // Unlike other tests, explicitly do not slot a menu in the parent element
            });

            afterEach(async () => {
                await disconnect();
            });

            it('should transition to the open state when the toggle button is clicked', async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                const toggleListener = createToggleListener(menuButton);
                menuButton.toggleButton!.control.click();
                expect(menuButton.open).toBeTrue();
                await toggleListener.promise;
                expect(toggleListener.spy).toHaveBeenCalledTimes(1);
                const expectedDetails: MenuButtonToggleEventDetail = {
                    newState: true,
                    oldState: false
                };
                const event = toggleListener.spy.calls.first()
                    .args[0] as CustomEvent;
                expect(event.detail).toEqual(expectedDetails);
            });

            it("should transition to the open state when 'Enter' is pressed while the toggle button is focused", async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                const toggleListener = createToggleListener(menuButton);
                const event = new KeyboardEvent('keypress', {
                    key: keyEnter
                } as KeyboardEventInit);
                menuButton.toggleButton!.control.dispatchEvent(event);
                expect(menuButton.open).toBeTrue();
                await toggleListener.promise;
                expect(toggleListener.spy).toHaveBeenCalledTimes(1);
                const expectedDetails: MenuButtonToggleEventDetail = {
                    newState: true,
                    oldState: false
                };
                const toggleEvent = toggleListener.spy.calls.first()
                    .args[0] as CustomEvent;
                expect(toggleEvent.detail).toEqual(expectedDetails);
            });

            it("should transition to the open state when 'Space' is pressed while the toggle button is focused", async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                const toggleListener = createToggleListener(menuButton);
                const event = new KeyboardEvent('keypress', {
                    key: keySpace
                } as KeyboardEventInit);
                menuButton.toggleButton!.control.dispatchEvent(event);
                expect(menuButton.open).toBeTrue();
                await toggleListener.promise;
                expect(toggleListener.spy).toHaveBeenCalledTimes(1);
                const expectedDetails: MenuButtonToggleEventDetail = {
                    newState: true,
                    oldState: false
                };
                const toggleEvent = toggleListener.spy.calls.first()
                    .args[0] as CustomEvent;
                expect(toggleEvent.detail).toEqual(expectedDetails);
            });

            it('should transition to the open state when the down arrow is pressed while the toggle button is focused', async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                const toggleListener = createToggleListener(menuButton);
                const event = new KeyboardEvent('keydown', {
                    key: keyArrowDown
                } as KeyboardEventInit);
                menuButton.toggleButton!.dispatchEvent(event);
                expect(menuButton.open).toBeTrue();
                await toggleListener.promise;
                expect(toggleListener.spy).toHaveBeenCalledTimes(1);
                const expectedDetails: MenuButtonToggleEventDetail = {
                    newState: true,
                    oldState: false
                };
                const toggleEvent = toggleListener.spy.calls.first()
                    .args[0] as CustomEvent;
                expect(toggleEvent.detail).toEqual(expectedDetails);
            });

            it('should transition to the open state when the up arrow is pressed while the toggle button is focused', async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                const toggleListener = createToggleListener(menuButton);
                const event = new KeyboardEvent('keydown', {
                    key: keyArrowUp
                } as KeyboardEventInit);
                menuButton.toggleButton!.dispatchEvent(event);
                expect(menuButton.open).toBeTrue();
                await toggleListener.promise;
                expect(toggleListener.spy).toHaveBeenCalledTimes(1);
                const expectedDetails: MenuButtonToggleEventDetail = {
                    newState: true,
                    oldState: false
                };
                const toggleEvent = toggleListener.spy.calls.first()
                    .args[0] as CustomEvent;
                expect(toggleEvent.detail).toEqual(expectedDetails);
            });

            it("should transition to the closed state when pressing 'Escape'", async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                await openMenu(menuButton);

                const event = new KeyboardEvent('keydown', {
                    key: keyEscape
                } as KeyboardEventInit);
                menuButton.region!.dispatchEvent(event);
                expect(menuButton.open).toBeFalse();
            });

            it("should focus the button when moving to the closed state by pressing 'Escape'", async () => {
                await connect();
                const menuButton = configuration.getMenuButton(element);
                await openMenu(menuButton);

                const event = new KeyboardEvent('keydown', {
                    key: keyEscape
                } as KeyboardEventInit);
                menuButton.region!.dispatchEvent(event);
                expect(document.activeElement).toEqual(element);
            });
        });
    }
});
