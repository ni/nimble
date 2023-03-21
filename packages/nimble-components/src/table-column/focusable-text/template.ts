import { html, ref } from '@microsoft/fast-element';
import type { FocusableTextCellView } from './cell-element';

export const cellTemplate = html<FocusableTextCellView>`
    <span tabindex="0" ${ref('focusableElement')}> ${x => x.content} </span>
`;
