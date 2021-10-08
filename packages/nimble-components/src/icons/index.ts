import { html } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { NimbleIcon } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';

export const template = html<Icon>`
    <div class="icon" :innerHTML=${x => x.icon.data}></div>
`;

/**
 * The base class for icon components
 */
export abstract class Icon extends FoundationElement {
    public constructor(public icon: NimbleIcon) {
        super();
    }
}
