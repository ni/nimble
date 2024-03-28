import { html, ref } from '@microsoft/fast-element';
import type { Drawer } from '.';

export const template = html<Drawer>`
    <dialog
        ${ref('dialog')}
        aria-label="${x => x.ariaLabel}"
        @cancel="${(x, c) => x.cancelHandler(c.event)}"
        @close="${(x, c) => x.closeHandler(c.event)}"
    >
        <div class="dialog-contents" ${ref('dialogContents')}>
            <slot></slot>
        </div>
    </dialog>
`;
