import { html } from '@microsoft/fast-element';
import { Menu, menuTag } from '..';
import { MenuItem, menuItemTag } from '../../menu-item';
import { Fixture, fixture } from '../../utilities/tests/fixture';
import { iconCheckTag } from '../../icons/check';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

describe('Menu', () => {
    async function setup(): Promise<Fixture<Menu>> {
        return fixture<Menu>(html`
            <${menuTag}>
                <${menuItemTag}>Item 1</${menuItemTag}>
                <${menuItemTag}>Item 2</${menuItemTag}>
            </${menuTag}>
        `);
    }

    it('should export its tag', () => {
        expect(menuTag).toBe('nimble-menu');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-menu')).toBeInstanceOf(Menu);
    });

    it('properly indents items when an icon is slotted or removed after connecting', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        await waitForUpdatesAsync();

        const items = element.querySelectorAll(menuItemTag);
        const item1 = items[0]!;
        const item2 = items[1]!;
        expect(item1.classList.contains('indent-0')).toBeTrue();
        expect(item2.classList.contains('indent-0')).toBeTrue();

        const icon = document.createElement(iconCheckTag);
        icon.slot = 'start';
        item2.appendChild(icon);
        await waitForUpdatesAsync();

        expect(item1.classList.contains('indent-1')).toBeTrue();
        expect(item2.classList.contains('indent-1')).toBeTrue();

        item2.removeChild(icon);
        await waitForUpdatesAsync();

        expect(item1.classList.contains('indent-0')).toBeTrue();
        expect(item1.classList.contains('indent-1')).toBeFalse();
        expect(item2.classList.contains('indent-0')).toBeTrue();
        expect(item2.classList.contains('indent-1')).toBeFalse();

        await disconnect();
    });
});
