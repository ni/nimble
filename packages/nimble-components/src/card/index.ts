import { DesignSystem, Card as FoundationCard } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-card': Card;
    }
}

/**
 * A nimble-styled card
 */
export class Card extends FoundationCard {}

const nimbleCard = Card.compose({
    baseName: 'card',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCard());
export const cardTag = 'nimble-card';
