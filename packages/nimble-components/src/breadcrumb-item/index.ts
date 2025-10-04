import { customElement } from '@ni/fast-element';
import {
    BreadcrumbItem as FoundationBreadcrumbItem,
    breadcrumbItemTemplate as template
} from '@ni/fast-foundation';
import { forwardSlash16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';
import { elementDefinitionContextMock } from '../utilities/models/mock';

export const breadcrumbItemTag = 'nimble-breadcrumb-item';

declare global {
    interface HTMLElementTagNameMap {
        [breadcrumbItemTag]: BreadcrumbItem;
    }
}

/**
 * A nimble-styled breadcrumb item
 */
@customElement({
    name: breadcrumbItemTag,
    template: template(elementDefinitionContextMock, {
        separator: forwardSlash16X16.data
    }),
    styles
})
export class BreadcrumbItem extends FoundationBreadcrumbItem {}
