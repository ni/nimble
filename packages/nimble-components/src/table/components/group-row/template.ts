/* eslint-disable @typescript-eslint/indent */
import { html, ref, when } from '@microsoft/fast-element';
import type { TableGroupRow } from '.';
import { buttonTag } from '../../../button';
import { ButtonAppearance } from '../../../button/types';
import { iconArrowExpanderRightTag } from '../../../icons/arrow-expander-right';
import { checkboxTag } from '../../../checkbox';
import {
    tableGroupCollapseLabel,
    tableGroupExpandLabel,
    tableGroupSelectAllLabel
} from '../../../label-provider/table/label-tokens';

// prettier-ignore
export const template = html<TableGroupRow>`
    <template
        role="row"
        @click=${x => x.onGroupExpandToggle()}
        style="--ni-private-table-group-row-indent-level: ${x => x.nestingLevel};"
    >
        ${when(x => x.selectable, html<TableGroupRow>`
            <span role="gridcell" class="checkbox-container">
                <${checkboxTag}
                    ${ref('selectionCheckbox')}
                    class="selection-checkbox"
                    @change="${(x, c) => x.onSelectionChange(c.event as CustomEvent)}"
                    @click="${(_, c) => c.event.stopPropagation()}"
                    title="${x => tableGroupSelectAllLabel.getValueFor(x)}"
                    aria-label="${x => tableGroupSelectAllLabel.getValueFor(x)}"
                >
                </${checkboxTag}>
            </span>
        `)}

        <span role="gridcell">
            <${buttonTag}
                appearance="${ButtonAppearance.ghost}"
                content-hidden
                class="expand-collapse-button"
                tabindex="-1"
                title="${x => (x.expanded ? tableGroupCollapseLabel.getValueFor(x) : tableGroupExpandLabel.getValueFor(x))}"
            >
                <${iconArrowExpanderRightTag} ${ref('expandIcon')} slot="start" class="expander-icon ${x => x.animationClass}"></${iconArrowExpanderRightTag}>
                ${x => (x.expanded ? tableGroupCollapseLabel.getValueFor(x) : tableGroupExpandLabel.getValueFor(x))}
            </${buttonTag}>
        </span>

        <div class="group-row-header-content">
            ${x => x.groupColumn?.columnInternals.groupHeaderViewTemplate}
            <span class="group-row-child-count">(${x => x.leafItemCount})</span>
        </div>
    </template>
`;
