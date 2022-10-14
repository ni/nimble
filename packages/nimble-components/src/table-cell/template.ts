import { html, when } from '@microsoft/fast-element';
import type { TableCell } from '.';

export const template = html<TableCell>`
  <template
      tabindex="-1"
      role="gridcell"
  >
    ${x => x.cellItemTemplate}

    ${when(x => x.hasMenu, html<TableCell>`
      <nimble-menu-button content-hidden appearance="ghost" @open-change="${(x, c) => x.onMenuOpenChange(c.event as CustomEvent)}">
        <nimble-icon-three-dots-line slot="start"></nimble-icon-three-dots-line>
        Row menu
        <slot name="cellActionMenu" slot="menu"></slot>
      </nimble-menu-button>
    `)}
  </template>
`;
