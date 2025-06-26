import { attr } from '@ni/fast-element';
import { FoundationElement } from '@ni/fast-foundation';

/**
 * Base class for mapping configuration elements
 */
export abstract class Mapping<T> extends FoundationElement {
    /**
     * The data value that is mapped to another representation
     */
    @attr()
    public key?: T;
}
