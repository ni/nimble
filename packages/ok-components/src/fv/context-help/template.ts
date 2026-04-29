import { html, when } from '@ni/fast-element';
import { iconInfoTag } from '@ni/nimble-components/dist/esm/icons/info';
import { tooltipTag } from '@ni/nimble-components/dist/esm/tooltip';
import type { FvContextHelp } from '.';

export const template = html<FvContextHelp>`
    <button
        id="${x => x.tooltipAnchorId}"
        class="context-help-trigger"
        type="button"
        aria-label="Show help"
    >
        <${iconInfoTag}></${iconInfoTag}>
    </button>
    <${tooltipTag}
        anchor="${x => x.tooltipAnchorId}"
        severity="${x => x.severity}"
        ?icon-visible="${x => x.iconVisible}"
    >
        ${when(x => x.text.length > 0, html<FvContextHelp>`
            <span>${x => x.text}</span>
        `)}
        <slot></slot>
    </${tooltipTag}>
`;