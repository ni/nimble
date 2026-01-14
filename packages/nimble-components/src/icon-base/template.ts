import { html } from '@ni/fast-element';
import type { SvgIcon } from '.';

// Avoiding any whitespace in the template because this is an inline element
export const template = html<SvgIcon>`<div
    class="icon"
    aria-hidden="true"
    :innerHTML=${x => x.icon.data}
></div>`;
