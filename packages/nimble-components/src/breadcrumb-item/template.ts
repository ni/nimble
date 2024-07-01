import { html, type ViewTemplate, when } from '@microsoft/fast-element';
import type {
    BreadcrumbItemOptions,
    FoundationElementTemplate
} from '@microsoft/fast-foundation';
import { template as anchorTemplate } from '../anchor/template';
import type { BreadcrumbItem } from '.';

// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<BreadcrumbItem>,
BreadcrumbItemOptions
> = (context, definition) => html<BreadcrumbItem>`
    <div role="listitem" class="listitem" part="listitem">
        ${when(x => x.href, html`
            ${anchorTemplate(context, definition)}
        `)}
        ${when(x => !x.href, html`
            <slot></slot>
        `)}
        ${when(x => x.separator, html`
            <span class="separator" part="separator" aria-hidden="true">
                <slot name="separator">${definition.separator || ''}</slot>
            </span>
        `)}
    </div>`;
