import { attr } from '@ni/fast-element';
import { FoundationElement } from '@ni/fast-foundation';
import type { IconSeverity } from './types';

/**
 * The base class for icon components. Implementors:
 * - Should not increase the API surface area, consumers of icons would not expect additional attributes to configure
 * - Should not add interactive components to the template, expect to be visual only
 * - Should respond well to sizing of the element
 * - Should respond to configuration of the severity attribute and other tokens such as theme
 */
export abstract class Icon extends FoundationElement {
    /**
     * @public
     * @remarks
     * HTML Attribute: severity
     */
    @attr
    public severity: IconSeverity;
}
