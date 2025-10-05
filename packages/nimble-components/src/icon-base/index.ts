import { attr } from '@ni/fast-element';
import { FoundationElement } from '@ni/fast-foundation';
import type { NimbleIcon } from '@ni/nimble-tokens/dist/icons/js';
import type { IconSeverity } from './types';

export { customElement } from '@ni/fast-element';
export { template } from './template';
export { styles } from './styles';

/**
 * The base class for icon components
 */
export class Icon extends FoundationElement {
    /**
     * @public
     * @remarks
     * HTML Attribute: severity
     */
    @attr
    public severity: IconSeverity;

    public constructor(/** @internal */ public readonly icon: NimbleIcon) {
        super();
    }
}
