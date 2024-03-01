import {
    DesignSystem,
    Accordion as FoundationAccordion
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'spright-accordion': Accordion;
    }
}

/**
 * A nimble-styled accordion
 */
export class Accordion extends FoundationAccordion {}

const sprightAccordion = Accordion.compose({
    baseName: 'accordion',
    baseClass: FoundationAccordion,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightAccordion());
export const accordionTag = 'spright-accordion';
