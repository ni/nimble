import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    DesignSystem,
    FoundationElementTemplate,
    Tab as FoundationTab
} from '@microsoft/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-tab': Tab;
    }
}

/**
 * A nimble-styled HTML tab
 */
export class Tab extends FoundationTab {}

const template: FoundationElementTemplate<ViewTemplate<Tab>> = (
    _context,
    _definition
) => html`
    <template slot="tab" role="tab" aria-disabled="${x => x.disabled}">
        <slot></slot>
        <div class="focus-indicator"></div>
        <div class="active-indicator"></div>
    </template>
`;

const nimbleTab = Tab.compose({
    baseName: 'tab',
    baseClass: FoundationTab,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTab());
