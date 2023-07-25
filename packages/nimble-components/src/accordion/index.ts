import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    Accordion as FoundationAccordion,
    accordionTemplate as template,
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { AccordionAppearance } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-accordion': Accordion;
    }
}

/**
 * A nimble-styled accordion
 */
export class Accordion extends FoundationAccordion {
    @attr
    public appearance: AccordionAppearance = AccordionAppearance.outline;
}

const nimbleAccordion = Accordion.compose({
    baseName: 'accordion',
    baseClass: FoundationAccordion,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAccordion());
export const accordionTag = DesignSystem.tagFor(Accordion);