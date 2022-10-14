import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { TableCell } from '.';

export const template = html<TableCell>`
  <template
      tabindex="-1"
      role="gridcell"
  >
    <!-- <slot name="cellActionMenu"></slot> -->
    ${x => x.cellItemTemplate}

    ${when(x => x.hasMenu, html`
      <nimble-menu-button content-hidden appearance="ghost">
        <nimble-icon-three-dots-line slot="start"></nimble-icon-three-dots-line>
        Row menu
        <slot name="cellActionMenu" slot="menu"></slot>
      </nimble-menu-button>
    `)}
  </template>
`;
