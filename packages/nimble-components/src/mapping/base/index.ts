import { attr } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { MappingKey } from './types';

/**
 * Base class for mapping configuration elements
 */
export abstract class Mapping extends FoundationElement {
    @attr()
    public key?: MappingKey;

    @attr()
    public text?: string;
}
