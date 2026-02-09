import { html, ref, slotted, ViewTemplate } from '@ni/fast-element';
import { type FoundationElementTemplate, type AnchorOptions, startSlotTemplate, endSlotTemplate } from '@ni/fast-foundation';
import type { AnchorStep } from '.';
import { severityTextTemplate } from '../patterns/severity/template';

export const template: FoundationElementTemplate<
ViewTemplate<AnchorStep>,
AnchorOptions
> = (context, definition) => html<AnchorStep>`
    <div class="container">
        <a
            class="control"
            part="control"
            download="${x => x.download}"
            href=${x => (x.disabled ? null : x.href)}
            hreflang="${x => x.hreflang}"
            ping="${x => x.ping}"
            referrerpolicy="${x => x.referrerpolicy}"
            rel="${x => x.rel}"
            target="${x => x.target}"
            type="${x => x.type}"
            tabindex="${x => x.tabIndex}"
            aria-atomic="${x => x.ariaAtomic}"
            aria-busy="${x => x.ariaBusy}"
            aria-controls="${x => x.ariaControls}"
            aria-current="${x => x.ariaCurrent}"
            aria-describedby="${x => x.ariaDescribedby}"
            aria-details="${x => x.ariaDetails}"
            aria-disabled="${x => x.ariaDisabled}"
            aria-errormessage="${x => x.ariaErrormessage}"
            aria-expanded="${x => x.ariaExpanded}"
            aria-flowto="${x => x.ariaFlowto}"
            aria-haspopup="${x => x.ariaHaspopup}"
            aria-hidden="${x => x.ariaHidden}"
            aria-invalid="${x => x.ariaInvalid}"
            aria-keyshortcuts="${x => x.ariaKeyshortcuts}"
            aria-label="${x => x.ariaLabel}"
            aria-labelledby="${x => x.ariaLabelledby}"
            aria-live="${x => x.ariaLive}"
            aria-owns="${x => x.ariaOwns}"
            aria-relevant="${x => x.ariaRelevant}"
            aria-roledescription="${x => x.ariaRoledescription}"
            ${ref('control')}
        >
            <div class="icon">
                <slot ${slotted('defaultSlottedContent')}></slot>
            </div>
            <div class="content">
                <div class="title">
                    ${startSlotTemplate(context, definition)}
                    <slot name="title"></slot>
                    ${endSlotTemplate(context, definition)}
                    <div class="line"></div>
                </div>
                <div class="subtitle">
                    <slot name="subtitle"></slot>
                </div>
            </div>
        </a>
        ${severityTextTemplate}
    </div>
`;
