import { html } from '@ni/fast-element';
import type { Icon } from '.';

// Avoiding any whitespace in the template because this is an inline element
// Note: Template is typed to Icon (not MultiColorIcon) because the template
// only accesses the 'icon' property which is defined on the base Icon class
export const multiColorTemplate = html<Icon>`<div
    class="icon"
    aria-hidden="true"
    :innerHTML=${x => x.icon.data}
></div>`;
