import { attr } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { MappingKey } from './types';

/**
 * Base class for mapping configuration elements
 */
export abstract class Mapping extends FoundationElement {
    /**
     * The data value that is mapped to another representation
     */
    @attr()
    public key?: MappingKey;

    /**
     * In the case of a mapping that maps to text, this is that mapped text.
     * For mappings to non-textual representations, this is a display string
     * that provides a description of the item and is used as the accessible name.
     */
    @attr()
    public text?: string;
}
