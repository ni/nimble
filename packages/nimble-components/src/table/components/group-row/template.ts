/* eslint-disable @typescript-eslint/indent */
import { html, ref, when } from '@microsoft/fast-element';
import type { TableGroupRow } from '.';
import { buttonTag } from '../../../button';
import { ButtonAppearance } from '../../../button/types';
import { iconArrowExpanderRightTag } from '../../../icons/arrow-expander-right';
import { checkboxTag } from '../../../checkbox';
import {
    tableGroupCollapseLabel,
    tableGroupExpandLabel
} from '../../../label-provider/table/label-tokens';

// prettier-ignore
export const template = html<TableGroupRow>`
    <template
        role="row"
        @click=${x => x.onGroupExpandToggle()}
        style="--ni-private-table-group-row-indent-level: ${x => x.nestingLevel};"
        @keydown=${(x, c) => x.onKeyDown(c.event as KeyboardEvent)}
        @focus=${(x, c) => x.onFocusIn(c.event)}
        @focusout=${(x, c) => x.onFocusOut(c.event)}
        aria-expanded="${x => x.expanded}"
    >
        ${when(x => x.selectable, html<TableGroupRow>`
            <span role="gridcell" class="checkbox-container">
                <${checkboxTag}
                    ${ref('selectionCheckbox')}
                    class="selection-checkbox"
                    @change="${(x, c) => x.onSelectionChange(c.event as CustomEvent)}"
                    @click="${(_, c) => c.event.stopPropagation()}"
                    tabindex="-1"
                    focusable
                >
                </${checkboxTag}>
            </span>
        `)}

        <div role="gridcell" class="expander-container">
            <${iconArrowExpanderRightTag} ${ref('expandIcon')} slot="start" class="expander-icon ${x => x.animationClass}"></${iconArrowExpanderRightTag}>
        </div>

        <div class="group-row-header-content">
            ${x => x.groupColumn?.columnInternals.groupHeaderViewTemplate}
            <span class="group-row-child-count">(${x => x.leafItemCount})</span>
        </div>
    </template>
`;
