import { attr } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { MappingKey } from './types';

/**
 * Base class for mapping configuration elements
 */
export abstract class Mapping extends FoundationElement {
    @attr({ mode: 'fromView' })
    public key?: MappingKey;

    @attr({ attribute: 'default-mapping', mode: 'boolean' })
    public defaultMapping = false;
}
