import { html, when } from '@microsoft/fast-element';
import type { TableCell } from '.';

export const template = html<TableCell>`
  <template
      role="gridcell"
  >
    ${x => x.cellItemTemplate}

    ${when(x => x.hasMenu, html<TableCell>`
      <nimble-menu-button content-hidden appearance="ghost" @opening="${x => x.onMenuOpening()}">
        <nimble-icon-three-dots-line slot="start"></nimble-icon-three-dots-line>
        Row menu
        <slot name="cellActionMenu" slot="menu"></slot>
      </nimble-menu-button>
    `)}
  </template>
`;
