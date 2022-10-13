import { html, ref, slotted } from '@microsoft/fast-element';
import type { Dialog } from '.';

export const template = html<Dialog>`
    <template>
        <dialog
            ${ref('dialogElement')}
            role="dialog"
            @cancel="${(x, c) => x.cancelHandler(c.event)}"
            aria-labelledby="header"
        >
            <header id="header">
                <div class="title">
                    <slot name="title"></slot>
                </div>
                <div class="subtitle">
                    <slot name="subtitle"></slot>
                </div>
            </header>
            <section>
                <slot></slot>
            </section>
            <footer class="${x => (x.footerIsEmpty ? 'empty' : '')}">
                <slot
                    name="footer"
                    ${slotted({ property: 'slottedFooterElements' })}
                ></slot>
            </footer>
        </dialog>
    </template>
`;
