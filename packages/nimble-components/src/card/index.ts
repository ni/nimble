import { customElement } from '@ni/fast-element';
import { Card as FoundationCard } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

export const cardTag = 'nimble-card';

declare global {
    interface HTMLElementTagNameMap {
        [cardTag]: Card;
    }
}

/**
 * A nimble-styled card
 */
@customElement({
    name: cardTag,
    template,
    styles
})
export class Card extends FoundationCard {}
