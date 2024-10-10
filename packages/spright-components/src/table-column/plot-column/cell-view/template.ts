import { html, when } from '@microsoft/fast-element';
import { overflow } from '@ni/nimble-components/src/utilities/directive/overflow';
import { TableColumnAlignment } from '@ni/nimble-components/src/table/types';
import type { TableColumnTextCellViewBase } from '@ni/nimble-components/src/table-column/text-base/cell-view';
import { buttonTag } from '@ni/nimble-components/src/button';
import { ButtonAppearance } from '@ni/nimble-components/src/button/types';
import { iconEyeTag } from '@ni/nimble-components/src/icons/eye';

// prettier-ignore
export const template = html<TableColumnTextCellViewBase>`
    <template
        class="
            ${x => (x.alignment === TableColumnAlignment.right ? 'right-align' : '')}
            ${x => (x.isPlaceholder ? 'placeholder' : '')}
        "
    >
        <span
            ${overflow('hasOverflow')}
            title=${x => (x.hasOverflow && x.text ? x.text : null)}
        >
            ${x => x.text}
        </span> 
        ${when(x => x.cellRecord?.plotEnabled, html<TableColumnTextCellViewBase>`
        <${buttonTag}
              appearance="${ButtonAppearance.ghost}"
              content-hidden
              class="expand-collapse-button"
              tabindex="-1"
              aria-hidden="true"
          >
              <${iconEyeTag}  slot="start"></${iconEyeTag}>
        </${buttonTag}>
    `)}
    </template>
`;