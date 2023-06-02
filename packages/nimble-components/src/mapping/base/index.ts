import { attr, ViewTemplate } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';

/**
 * An element to be given as content to a nimble-table-column-mapping or nimble-table-column-icon.
 * This is a base class from which other specific mapping types (e.g. MappingIcon, MappingText) are derived.
 */
export abstract class Mapping extends FoundationElement {
    @attr({ mode: 'fromView' })
    public key?: string | number | boolean;

    @attr({ attribute: 'default-mapping', mode: 'boolean' })
    public defaultMapping = false;

    public abstract cellViewTemplate: ViewTemplate;
    public abstract groupHeaderViewTemplate: ViewTemplate;
}
