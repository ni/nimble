import { html, ref } from '@ni/fast-element';
import type { Drawer } from '.';

export const template = html<Drawer>`
    <dialog
        ${ref('dialog')}
        closedby="${x => (x.preventDismiss ? 'none' : 'closerequest')}"
        aria-label="${x => x.ariaLabel}"
        @cancel="${(x, c) => x.cancelHandler(c.event)}"
        @close="${(x, c) => x.closeHandler(c.event)}"
    >
        <div class="dialog-contents">
            <slot></slot>
        </div>
    </dialog>
`;
