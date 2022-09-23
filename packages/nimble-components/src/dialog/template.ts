import { html, ref, slotted } from '@microsoft/fast-element';
import type { Dialog } from '.';

export const template = html<Dialog>`
    <template>
        <dialog
            ${ref('dialogElement')}
            role="alertdialog"
            @cancel="${(x, c) => x.cancelHandler(c.event)}"
            aria-labelledby="title"
        >
            <header>
                <span id="title" class="title">
                    <slot name="title"></slot>
                </span>
                <slot name="subtitle"></slot>
            </header>
            <section>
                <slot></slot>
            </section>
            <footer class="${x => (x.footerIsEmpty ? 'empty' : '')}">
                <slot name="footer" ${slotted({ property: 'slottedFooterElements' })}></slot>
            </footer>
        </dialog>
    </template>
`;
