import { html, ref, slotted, when } from '@ni/fast-element';
import type { Stepper } from '.';
import { buttonTag } from '../button';
import { ButtonAppearance } from '../button/types';
import {
    scrollBackwardLabel,
    scrollForwardLabel
} from '../label-provider/core/label-tokens';
import { iconArrowExpanderLeftTag } from '../icons/arrow-expander-left';
import { iconArrowExpanderRightTag } from '../icons/arrow-expander-right';
import { iconArrowExpanderUpTag } from '../icons/arrow-expander-up';
import { iconArrowExpanderDownTag } from '../icons/arrow-expander-down';

export const template = html<Stepper>`
    ${when(x => x.showScrollButtons, html<Stepper>`
        <${buttonTag}
            content-hidden
            class="scroll-button start"
            appearance="${ButtonAppearance.ghost}"
            @click="${x => x.onScrollStartClick()}"
            ${ref('startScrollButton')}
        >
            ${x => scrollForwardLabel.getValueFor(x)}
            ${when(x => x.orientation === 'horizontal', html`<${iconArrowExpanderLeftTag} slot="start"></${iconArrowExpanderLeftTag}>`)}
            ${when(x => x.orientation === 'vertical', html`<${iconArrowExpanderUpTag} slot="start"></${iconArrowExpanderUpTag}>`)}
        </${buttonTag}>
    `)}
    <ol ${ref('list')} class="list"><slot
            name="step"
            ${slotted('steps')}
        ></slot></ol>
    ${when(x => x.showScrollButtons, html<Stepper>`
        <${buttonTag}
            content-hidden
            class="scroll-button end"
            appearance="${ButtonAppearance.ghost}"
            @click="${x => x.onScrollEndClick()}"
        >
            ${x => scrollBackwardLabel.getValueFor(x)}
            ${when(x => x.orientation === 'horizontal', html`<${iconArrowExpanderRightTag} slot="start"></${iconArrowExpanderRightTag}>`)}
            ${when(x => x.orientation === 'vertical', html`<${iconArrowExpanderDownTag} slot="start"></${iconArrowExpanderDownTag}>`)}
        </${buttonTag}>
    `)}
`;
