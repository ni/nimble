import { html, when } from '@ni/fast-element';
import type { ChatToolCallInput } from '.';

export const template = html<ChatToolCallInput>`
    <div class="input-row">
        ${when(x => x.name !== undefined && x.name.length > 0, html<ChatToolCallInput>`
            <span class="input-name">${x => x.name}</span><span aria-hidden="true">:</span>
        `)}
        <span class="input-value">${x => x.formattedValue}</span>
    </div>
`;