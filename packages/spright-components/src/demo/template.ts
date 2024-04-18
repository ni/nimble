import { html } from '@microsoft/fast-element';
import { iconUserTag } from '@ni/nimble-components/dist/esm/icons/user';
import type { Demo } from '.';

export const template = html<Demo>`
    <div
        class="backplate ${x => x.shape}"
        part="backplate"
        style="${x => (x.fill ? `background-color: ${x.fill};` : undefined)}"
    >
        <a
            class="link"
            part="link"
            href="${x => (x.link ? x.link : undefined)}"
            style="${x => (x.color ? `color: var(--avatar-color-${x.color});` : undefined)}"
        >
            <${iconUserTag}/>
            <slot class="content" part="content"><slot>
        </a>
    </div>
    <slot name="badge" part="badge"></slot>
`;
