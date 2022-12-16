import { html, repeat } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableRow } from '.';
import { TableCell } from '../cell';

// prettier-ignore
export const template = html<TableRow>`
    <template role="row">
        ${repeat(x => x.columns, html<string>`
            <${DesignSystem.tagFor(TableCell)}
                class="cell"
                :data="${(x, c) => (c.parent as TableRow).getCellValue(x)}"
            >
            </${DesignSystem.tagFor(TableCell)}>
        `)}
    </template>
`;
