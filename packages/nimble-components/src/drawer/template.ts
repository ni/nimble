import { html, ref } from '@microsoft/fast-element';
import type { Drawer } from '.';

export const template = html<Drawer>`
    <dialog
        ${ref('dialog')}
        aria-label="${x => x.ariaLabel}"
        @cancel="${(x, c) => x.cancelHandler(c.event)}"
        @close="${x => x.closeHandler()}"
    >
        <div class="dialog-contents">
            <button class="bug-workaround"></button>
            <slot></slot>
        </div>
    </dialog>
`;
