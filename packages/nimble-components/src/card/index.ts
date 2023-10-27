import { DesignSystem, Card as FastCard } from '@microsoft/fast-foundation';
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
export class Card extends FastCard {}

const nimbleCard = Card.compose({
    baseName: 'card',
    baseClass: FastCard,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCard());
export const cardTag = DesignSystem.tagFor(Card);
