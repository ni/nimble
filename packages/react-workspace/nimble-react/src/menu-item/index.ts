import { MenuItem } from '@ni/nimble-components/dist/esm/menu-item';
import { wrap } from '../utilities/react-wrapper';

export const NimbleMenuItem = wrap(MenuItem, {
    events: {
        onChange: 'change',
    }
});

export interface MenuItemChangeEvent extends CustomEvent {
    target: MenuItem;
}
