import { html } from '@ni/fast-element';
import type { IconSvg } from '.';

// Avoiding any whitespace in the template because this is an inline element
export const template = html<IconSvg>`<div
    class="icon"
    aria-hidden="true"
    :innerHTML=${x => x.icon.data}
></div>`;
