import {
    elements,
    html,
    ref,
    repeat,
    slotted,
    when,
    type ViewTemplate
} from '@microsoft/fast-element';
import type { FoundationElementTemplate } from '@microsoft/fast-foundation';
import type { Breadcrumb } from '.';
import { breadcrumbItemTag, type BreadcrumbItem } from '../breadcrumb-item';
import { menuButtonTag } from '../menu-button';
import { menuTag } from '../menu';
import { anchorMenuItemTag } from '../anchor-menu-item';
import { iconThreeDotsLineTag } from '../icons/three-dots-line';
import { CollapseState } from './types';

// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<Breadcrumb>
> = () => html<Breadcrumb>`
    <template role="navigation">
        <div ${ref('list')} role="list" part="list"
            class="list ${x => x.collapseState}"
        >
            <slot
                ${slotted({ property: 'slottedBreadcrumbItems', filter: elements() })}
            ></slot>
            ${when(x => x.collapseState !== CollapseState.none, html<Breadcrumb>`
                <${breadcrumbItemTag}>
                    <${menuButtonTag}
                        appearance="ghost"
                        content-hidden
                        class="collapsed-items-button"
                    >
                        <${iconThreeDotsLineTag} slot="start"></${iconThreeDotsLineTag}>
                        <${menuTag} slot="menu">
                            ${repeat(x => x.collapsedItems, html<BreadcrumbItem>`
                                <${anchorMenuItemTag} href="${x => x.href}">
                                    ${x => x.textContent}
                                </${anchorMenuItemTag}>
                            `)}
                        </${menuTag}>
                    </${menuButtonTag}>
                </${breadcrumbItemTag}>
            `)}
        </div>
    </template>
`;
