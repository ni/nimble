import { html, when } from '@microsoft/fast-element';
import type { TableCell } from '.';

export const template = html<TableCell>`
  <template
      tabindex="-1"
      role="gridcell"
  >
    <slot></slot>
  </template>
`;