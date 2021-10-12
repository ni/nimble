import { FoundationElement } from '@microsoft/fast-foundation';
import type { NimbleIcon } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';

/**
 * The base class for icon components
 */
export class Icon extends FoundationElement {
    public constructor(public icon: NimbleIcon) {
        super();
    }
}
