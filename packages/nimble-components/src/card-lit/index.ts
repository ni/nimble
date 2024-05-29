// import {
//     DesignSystem,
//     Card as FoundationCard
// } from '@microsoft/fast-foundation';
import { CSSResult, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators';

import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-card-lit': CardLit;
    }
}

/**
 * A nimble-styled card
 */
@customElement('nimble-card-lit')
export class CardLit extends LitElement {
    public static override styles: CSSResult = styles;

    protected override render(): TemplateResult {
        return template;
    }
}

// const nimbleCard = CardLit.compose({
//     baseName: 'card-lit',
//     baseClass: FoundationCard,
//     template,
//     styles
// });

// DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCard());
export const cardTag = 'nimble-card-lit';
