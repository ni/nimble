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
     * For mappings to non-textual representations, this is a string that can
     * be displayed in contexts such as group headers or tooltips and used as
     * an accessible label.
     */
    @attr()
    public text?: string;
}
