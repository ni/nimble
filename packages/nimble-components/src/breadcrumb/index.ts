import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    Breadcrumb as FoundationBreadcrumb,
    breadcrumbTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import type { BreadcrumbAppearance } from './types';

export const breadcrumbTag = 'nimble-breadcrumb';
declare global {
    interface HTMLElementTagNameMap {
        [breadcrumbTag]: Breadcrumb;
    }
}

/**
 * A nimble-styled breadcrumb
 */
export class Breadcrumb extends FoundationBreadcrumb {
    @attr
    public appearance: BreadcrumbAppearance;
}

const nimbleBreadcrumb = Breadcrumb.compose({
    baseName: breadcrumbTag,
    baseClass: FoundationBreadcrumb,
    template,
    styles
});

DesignSystem.getOrCreate().register(nimbleBreadcrumb());
