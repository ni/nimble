import { html } from '@ni/fast-element';
import type { AnchoredRegion } from '.';

export const template = html<AnchoredRegion>`
    <template class="${x => (x.initialLayoutComplete ? 'loaded' : '')}">
        <slot></slot>
    </template>
`;
