import { Table } from '@ni/nimble-components/dist/esm/table';
import { wrap } from '../utilities/react-wrapper';

export const NimbleTable = wrap(Table, {
    events: {
        onActionMenuBeforetoggle: 'action-menu-beforetoggle',
        onActionMenuToggle: 'action-menu-toggle',
        onSelectionChange: 'selection-change',
        onColumnConfigurationChange: 'column-configuration-change',
        onRowExpandToggle: 'row-expand-toggle',
    }
});
