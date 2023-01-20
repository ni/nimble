import { html, ViewTemplate } from '@microsoft/fast-element';
import type { FoundationElementTemplate } from '@microsoft/fast-foundation';
import type { AnchorTab, TabOptions } from '.';

export const template: FoundationElementTemplate<
ViewTemplate<AnchorTab>,
TabOptions
> = () => html<AnchorTab>`
    <template slot="anchortab" role="tab" aria-disabled="${x => x.disabled}">
        <a
            download="${x => x.download}"
            href=${x => (x.disabled ? null : x.href)}
            hreflang="${x => x.hreflang}"
            ping="${x => x.ping}"
            referrerpolicy="${x => x.referrerpolicy}"
            rel="${x => x.rel}"
            target="${x => x.target}"
            type="${x => x.type}"
            tabindex="-1"
        >
            <slot></slot>
        </a>
    </template>
`;
