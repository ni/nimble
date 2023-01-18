import { html, ref } from '@microsoft/fast-element';
import type { TableCell } from '.';

// prettier-ignore
export const template = html<TableCell>`
    <template role="cell">
        <div ${ref('cellContentContainer')} class="cell-content-container"></div>
    </template>
`;
