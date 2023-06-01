import { attr, ViewTemplate } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';

/**
 * Maps values to a template
 */
export abstract class Mapping extends FoundationElement {
    @attr({ mode: 'fromView' })
    public key?: string | number | boolean;

    @attr({ attribute: 'default-mapping', mode: 'boolean' })
    public defaultMapping = false;

    public abstract cellViewTemplate: ViewTemplate;
    public abstract groupHeaderViewTemplate: ViewTemplate;
}
