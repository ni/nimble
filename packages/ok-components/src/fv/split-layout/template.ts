import { html, when } from '@ni/fast-element';
import { fvSplitterTag } from '../splitter';
import type { FvSplitLayout } from '.';

export const template = html<FvSplitLayout>`
    <div class="layout" style="grid-template-columns: ${x => x.gridTemplateColumns}">
        <div class="pane primary" id="${x => x.primaryPaneId}">
            <slot name="primary"></slot>
        </div>
        ${when(
            x => !x.collapsed,
            html<FvSplitLayout>`
                <${fvSplitterTag}
                    position="${x => x.position}"
                    min="${x => x.effectiveMin}"
                    max="${x => x.effectiveMax}"
                    step="${x => x.step}"
                    aria-controls="${x => `${x.primaryPaneId} ${x.secondaryPaneId}`}"
                    @input="${(x, c) => x.handleSplitterInput(c.event)}"
                    @change="${(x, c) => x.handleSplitterChange(c.event)}"
                ></${fvSplitterTag}>
                <div class="pane secondary" id="${x => x.secondaryPaneId}">
                    <slot name="secondary"></slot>
                </div>
            `
        )}
    </div>
`;
