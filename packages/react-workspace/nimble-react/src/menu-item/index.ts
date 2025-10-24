import { MenuItem } from '@ni/nimble-components/dist/esm/menu-item';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { type MenuItem };
export const NimbleMenuItem = wrap(MenuItem, {
    events: {
        onChange: 'change' as EventName<MenuItemChangeEvent>,
    }
});
export interface MenuItemChangeEvent extends CustomEvent {
    target: MenuItem;
}
