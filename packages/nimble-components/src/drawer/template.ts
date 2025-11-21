import { html, ref } from '@ni/fast-element';
import type { Drawer } from '.';

export const template = html<Drawer>`
    <dialog
        ${ref('dialog')}
        aria-label="${x => x.ariaLabel}"
        @cancel="${(x, c) => x.cancelHandler(c.event)}"
        @close="${(x, c) => x.closeHandler(c.event)}"
        closedby="${x => (x.preventDismiss ? 'none' : 'closerequest')}"
    >
        <div class="dialog-contents">
            <slot></slot>
        </div>
    </dialog>
`;
