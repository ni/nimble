import { html, ref } from '@ni/fast-element';
import type { ExTableColumnMultiStateButtonCellView } from '.';

export const template = html<ExTableColumnMultiStateButtonCellView>`
    <button
        ${ref('button')}
        @click="${(x, c) => x.onButtonClick(c.event)}"
        class=${x => x.stateCssClass}
    >
    </button>
`;
