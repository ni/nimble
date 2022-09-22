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
                <span class="subtitle">
                    <slot name="subtitle"></slot>
                </span>
            </header>
            <section>
                <span class="content">
                    <slot></slot>
                </span>
            </section>
            <footer>
                <span class="footer-start-container">
                    <slot name="footer-start" ${slotted({ property: 'slottedFooterStart' })}></slot>
                </span>
                <span class="footer-middle-container">
                    <slot name="footer-middle" ${slotted({ property: 'slottedFooterMiddle' })}></slot>
                </span>
                <span class="footer-end-container">
                    <slot name="footer-end" ${slotted({ property: 'slottedFooterEnd' })}></slot>
                </span>
            </footer>
        </dialog>
    </template>
`;
