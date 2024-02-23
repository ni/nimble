import { html, ref } from '@microsoft/fast-element';
import type { Drawer } from '.';

export const template = html<Drawer>`
    <dialog
        ${ref('dialogElement')}
        aria-label="${x => x.ariaLabel}"
        @cancel="${(x, c) => x.cancelHandler(c.event)}"
        @close="${x => x.closeHandler()}"
    >
        <div class="dialog-contents">
            <slot></slot>
        </div>
    </dialog>
`;
