import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { TableCell } from '.';

export const template = html<TableCell>`
  <template
      tabindex="-1"
      role="gridcell"
  >
    <!-- <slot></slot> -->
    ${x => x.cellItemTemplate}
  </template>
`;
