import { html, ref } from '@microsoft/fast-element';
import type { Dialog } from '.';

export const template = html<Dialog>`
    <template>
        <dialog
            ${ref('dialogElement')}
            role="alertdialog"
            aria-label="${x => x.ariaLabel}"
            @cancel="${(x, c) => x.cancelHandler(c.event)}"
            @close="${x => x.closeHandler()}"
        >
            <slot></slot>
        </dialog>
    </template>
`;
