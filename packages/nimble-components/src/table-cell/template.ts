import { html, ViewTemplate } from '@microsoft/fast-element';
import type { TableCell } from '.';

export function dataGridCellTemplate(): ViewTemplate<TableCell> {
    return html<TableCell>`
      <template
          tabindex="-1"
          role="gridcell"
      >
            <slot></slot>
      </template>
    `;
}
