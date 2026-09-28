import { html, slotted } from '@ni/fast-element';
import type { ChatToolCall } from '.';
import { statusIconTemplate } from '../status-icon.template';

export const template = html<ChatToolCall>`
    <div class="tool-call-row">
        <span class="status-icon">${statusIconTemplate}</span>
        <span class="tool-name">${x => x.name ?? ''}</span>
        <span class="status-label">${x => x.statusLabel}</span>
    </div>
    <div class="input-list">
        <slot ${slotted({ property: 'slottedInputElements' })}></slot>
    </div>
`;