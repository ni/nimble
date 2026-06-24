import { html, ref, slotted } from '@ni/fast-element';
import type { ChatConversation } from '.';

export const template = html<ChatConversation>`
<div class="toolbar ${x => (x.toolbarEmpty ? 'toolbar-empty' : '')}">
    <slot name="toolbar" ${slotted({ property: 'slottedToolbarElements' })}></slot>
</div>
<div class="start ${x => (x.startEmpty ? 'start-empty' : '')}">
    <slot name="start" ${slotted({ property: 'slottedStartElements' })}></slot>
</div>
<div class="messages" ${ref('messagesContainer')}>
    <div class="messages-history ${x => (x.historyEmpty ? 'region-empty' : '')}">
        <slot name="history" ${slotted({ property: 'slottedHistoryMessages' })}></slot>
    </div>
    <div class="messages-anchored ${x => (x.autoScrollManager.anchorActive ? 'anchor-active' : '')}" ${ref('anchoredContainer')}>
        <slot ${slotted({ property: 'slottedMessages' })}></slot>
    </div>
</div>
<div class="input ${x => (x.inputEmpty ? 'input-empty' : '')}">
    <slot name="input" ${slotted({ property: 'slottedInputElements' })}>
    </slot>
</div>
<div class="end ${x => (x.endEmpty ? 'end-empty' : '')}">
    <slot name="end" ${slotted({ property: 'slottedEndElements' })}></slot>
</div>
`;
