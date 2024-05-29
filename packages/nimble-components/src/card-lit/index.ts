// import {
//     DesignSystem,
//     Card as FoundationCard
// } from '@microsoft/fast-foundation';
import { CSSResult, LitElement, TemplateResult } from 'lit';
// .js is needed for storybook build to succeed, otherwise get webpack build error
// Module not found: Error: Package path ./decorators is not exported from package /Users/jesse/Documents/GitHub/nimble2/node_modules/lit
import { customElement } from 'lit/decorators.js';

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
export const cardLitTag = 'nimble-card-lit';
