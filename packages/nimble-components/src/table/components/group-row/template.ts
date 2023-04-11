/* eslint-disable @typescript-eslint/indent */
import { html, ref } from '@microsoft/fast-element';
import type { TableGroupRow } from '.';
import { buttonTag } from '../../../button';
import { ButtonAppearance } from '../../../button/types';
import { iconArrowExpanderRightTag } from '../../../icons/arrow-expander-right';

// prettier-ignore
export const template = html<TableGroupRow>`
    <template @click=${x => x.onGroupExpandToggle()} style="--ni-private-table-group-row-indent-level: ${x => x.nestingLevel};">
        <${buttonTag}
            appearance="${ButtonAppearance.ghost}"
            content-hidden
            class="expand-collapse-button"
            tabindex="-1"
        >
            <${iconArrowExpanderRightTag} ${ref('expandIcon')} slot="start" class="expander-icon ${x => x.animationClass}"></${iconArrowExpanderRightTag}>
        </${buttonTag}>
        <div class="group-row-header-content">
            ${x => x.groupColumn?.columnInternals.groupHeaderViewTemplate}
            <div class="group-row-child-count">(${x => x.leafItemCount})</span>
        </div>
    </template>
`;
