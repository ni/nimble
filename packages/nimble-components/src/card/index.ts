import {
    DesignSystem,
    Card as FoundationCard
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

const baseName = 'card';
export const cardTag = `nimble-${baseName}`;
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
    baseName,
    baseClass: FoundationCard,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCard());
