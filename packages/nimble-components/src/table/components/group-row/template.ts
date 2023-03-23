/* eslint-disable @typescript-eslint/indent */
import { html, ref, when } from '@microsoft/fast-element';
import type { TableGroupRow } from '.';

// prettier-ignore
export const template = html<TableGroupRow>`
    <template @click=${x => x.onGroupExpandToggle()} style="--ni-private-table-group-row-indent-level: ${x => x.nestingLevel};">
        <nimble-button
            appearance="ghost"
            content-hidden
            class="expand-collapse-button"
            tabindex="-1"
        >
            <nimble-icon-arrow-expander-right ${ref('expandIcon')} slot="start" class="expander-icon ${x => x.animationClass}"></nimble-icon-arrow-expander-right>
        </nimble-button>
        ${when(x => x.groupHeaderViewTag, x => {
        const groupHeaderViewTag = x.groupHeaderViewTag!;
        return html<TableGroupRow>`
                <${groupHeaderViewTag}
                    :groupHeaderValue="${y => y.groupRowValue}"
                    :columnConfig="${y => y.columnConfig}"
                    class="group-header-value"
                    >
                </${groupHeaderViewTag}>
            `;
        })}
        <div class="group-row-child-count">(${x => x.leafItemCount})</span>
    </template>
`;
