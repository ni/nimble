import { html, slotted } from '@ni/fast-element';
import type { ChatConversation } from '.';

export const template = html<ChatConversation>`
<div class="messages"><slot></slot></div>
<div class="input ${x => (x.inputEmpty ? 'input-empty' : '')}">
    <slot name="input" ${slotted({ property: 'slottedInputElements' })}>
    </slot>
</div>
`;
