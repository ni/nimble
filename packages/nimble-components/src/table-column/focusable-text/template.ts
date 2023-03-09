import { html, ref } from '@microsoft/fast-element';
import type { FocusableTextCellElement } from './cell-element';

export const cellTemplate = html<FocusableTextCellElement>`
    <span tabindex="0" ${ref('focusableElement')}> ${x => x.content} </span>
`;
