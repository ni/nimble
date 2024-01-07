import {
    DesignSystem,
    Card as FoundationCard
} from '@microsoft/fast-foundation';
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
export class Card extends FoundationCard {}

const nimbleCard = Card.compose({
    baseName: cardTag,
    baseClass: FoundationCard,
    template,
    styles
});

DesignSystem.getOrCreate().register(nimbleCard());
