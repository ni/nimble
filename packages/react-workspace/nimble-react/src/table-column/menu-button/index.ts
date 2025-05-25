import { TableColumnMenuButton } from '@ni/nimble-components/dist/esm/table-column/menu-button';
import { wrap } from '../../utilities/react-wrapper';

export const NimbleTableColumnMenuButton = wrap(TableColumnMenuButton, {
    events: {
        onMenuButtonColumnToggle: 'menu-button-column-toggle',
        onMenuButtonColumnBeforetoggle: 'menu-button-column-beforetoggle',
    }
});
