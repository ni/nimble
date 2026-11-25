import { html, type ViewTemplate } from '@ni/fast-element';
import type { FvDashboardCard } from '.';

const slot = (name = ''): ViewTemplate<FvDashboardCard> => html<FvDashboardCard>`
    <slot
        name="${name}"
        @slotchange="${(x, c) => x.handleSlotChange(c.event)}"
    ></slot>
`;

export const template = html<FvDashboardCard>`
    <article class="card-shell ${x => (x.hasIconContent ? 'has-icon' : '')}" part="card-shell">
        <div class="icon ${x => (x.hasTitleContent && !x.hasContextContent ? 'align-title' : '')}" ?hidden="${x => !x.hasIconContent}">${slot('icon')}</div>
        <header class="header-row" ?hidden="${x => !x.hasHeaderContent}">
            <div class="title-group">
                ${slot('context')}
                ${slot('title')}
                ${slot('subtitle')}
            </div>
            <div class="header-end" ?hidden="${x => !x.hasStatusContent && !x.hasActionsContent}">
                ${slot('status')}
                <div class="actions" ?hidden="${x => !x.hasActionsContent}">${slot('actions')}</div>
            </div>
        </header>
        <div class="content" ?hidden="${x => !x.hasDefaultContent}">
            ${slot()}
        </div>
        <div class="supporting" ?hidden="${x => !x.hasSupportingContent}">
            ${slot('supporting')}
        </div>
        <footer class="footer" ?hidden="${x => !x.hasFooterContent}">
            ${slot('footer')}
        </footer>
    </article>
`;
