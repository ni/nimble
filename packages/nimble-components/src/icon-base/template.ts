import { html } from '@microsoft/fast-element';
import type { Icon } from '.';

// Avoiding any whitespace in the template because this is an inline element
export const template = html<Icon>`<div
    class="icon"
    aria-hidden="true"
    :innerHTML=${x => x.icon.data}
></div>`;
