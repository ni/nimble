import { html, ref, ViewTemplate, when } from '@ni/fast-element';
import { endSlotTemplate, startSlotTemplate, type ButtonOptions, type FoundationElementTemplate } from '@ni/fast-foundation';
import type { Step } from '.';
import { severityTextTemplate } from '../patterns/severity/template';
import { iconCheckTag } from '../icons/check';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import { iconTriangleFilledTag } from '../icons/triangle-filled';
import { Severity } from '../patterns/severity/types';
import { popupIconCompletedLabel, popupIconCurrentLabel, popupIconErrorLabel, popupIconWarningLabel } from '../label-provider/core/label-tokens';
import type { StepPattern } from '../patterns/step/types';

export const template: FoundationElementTemplate<
ViewTemplate<Step>,
ButtonOptions
> = (context, definition) => html`
    <template slot="step">
        <li class="
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
                    <span class="current-label">${x => (x.selected ? popupIconCurrentLabel.getValueFor(x) : '')}</span>
                    <div class="step-indicator"><slot name="step-indicator"><span aria-hidden="true">${x => x.stepInternals.position}</span></slot></div>
                    <div class="icon-severity">
                        ${when(x => x.severity === Severity.error, html<StepPattern>`<${iconExclamationMarkTag} role="img" aria-label="${x => popupIconErrorLabel.getValueFor(x)}"></${iconExclamationMarkTag}>`)}
                        ${when(x => x.severity === Severity.warning, html<StepPattern>`<${iconTriangleFilledTag} role="img" aria-label="${x => popupIconWarningLabel.getValueFor(x)}"></${iconTriangleFilledTag}>`)}
                        ${when(x => x.severity === Severity.success, html<StepPattern>`<${iconCheckTag} role="img" aria-label="${x => popupIconCompletedLabel.getValueFor(x)}"></${iconCheckTag}>`)}
                    </div>
                </div>
                <div class="top-spacer"></div>
                <div class="title">${startSlotTemplate(context, definition)}<slot name="title"></slot>${endSlotTemplate(context, definition)}</div>
                <div class="line"></div>
                <div class="subtitle"><slot name="subtitle"></slot></div>
            </button>
            ${severityTextTemplate}
        </li>
    </template>
`;
