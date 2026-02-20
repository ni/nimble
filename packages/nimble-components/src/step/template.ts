import { html, ref, slotted, ViewTemplate } from '@ni/fast-element';
import { endSlotTemplate, startSlotTemplate, type ButtonOptions, type FoundationElementTemplate } from '@ni/fast-foundation';
import type { Step } from '.';
import { severityTextTemplate } from '../patterns/severity/template';

export const template: FoundationElementTemplate<
ViewTemplate<Step>,
ButtonOptions
> = (context, definition) => html`
    <template slot="step">
        <div class="
            container
            ${x => (x.stepInternals.orientation === 'vertical' ? 'vertical' : '')}
            ${x => (x.stepInternals.last ? 'last' : '')}
        ">
            <button
                class="control"
                part="control"
                ?autofocus="${x => x.autofocus}"
                ?disabled="${x => x.disabled}"
                form="${x => x.formId}"
                formaction="${x => x.formaction}"
                formenctype="${x => x.formenctype}"
                formmethod="${x => x.formmethod}"
                formnovalidate="${x => x.formnovalidate}"
                formtarget="${x => x.formtarget}"
                name="${x => x.name}"
                type="${x => x.type}"
                value="${x => x.value}"
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
                aria-pressed="${x => x.ariaPressed}"
                aria-relevant="${x => x.ariaRelevant}"
                aria-roledescription="${x => x.ariaRoledescription}"
                ${ref('control')}
            >
                <div class="icon"> 
                    <slot ${slotted('defaultSlottedContent')}></slot>
                </div>
                <div class="content">
                    <div class="title-wrapper">
                        ${startSlotTemplate(context, definition)}
                        <div class="title"><slot name="title"></slot></div>
                        ${endSlotTemplate(context, definition)}
                        <div class="line"></div>
                    </div>
                    <div class="subtitle">
                        <slot name="subtitle"></slot>
                    </div>
                </div>
            </button>
            ${severityTextTemplate}
        </div>
    </template>
`;
