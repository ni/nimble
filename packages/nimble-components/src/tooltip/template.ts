import { html } from '@microsoft/fast-element';
import type { Tooltip } from '.';

export const template = html<Tooltip>`
    <template>
        <div class="tooltip-container">
            <span class="chosen-icon state-icon" part="state-icon">
                <slot name="state-icon"></slot>
            </span>
        </div>
    </template>
`;