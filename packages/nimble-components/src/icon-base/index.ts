import { attr } from '@ni/fast-element';
import { FoundationElement } from '@ni/fast-foundation';
import type { IconSeverity } from './types';

/**
 * The base class for icon components
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
