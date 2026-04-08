import { attr } from '@ni/fast-element';
import { FoundationElement } from '@ni/fast-foundation';

/**
 * Base class for mapping configuration elements
 */
export abstract class Mapping<T> extends FoundationElement {
    /**
     * Getter for the `key` property for environments that do not support properties named "key"
     */
    public get keyValue(): T | undefined {
        return this.key;
    }

    /**
     * Setter for the `key` property for environments that do not support properties named "key"
     */
    public set keyValue(value: T | undefined) {
        this.key = value;
    }

    /**
     * The data value that is mapped to another representation
     */
    @attr()
    public key?: T;
}
