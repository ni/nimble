import {
    DesignSystem,
    Accordion as FoundationAccordion,
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-accordion': Accordion;
    }
}

/**
 * A nimble-styled accordion
 */
export class Accordion extends FoundationAccordion {}

const nimbleAccordion = Accordion.compose({
    baseName: 'accordion',
    baseClass: FoundationAccordion,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAccordion());
export const accordionTag = DesignSystem.tagFor(Accordion);