import { attr } from '@ni/fast-element';
import {
    DesignSystem,
    Breadcrumb as FoundationBreadcrumb,
    breadcrumbTemplate as template
} from '@ni/fast-foundation';
import { styles } from './styles';
import type { BreadcrumbAppearance } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-breadcrumb': Breadcrumb;
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
    baseName: 'breadcrumb',
    baseClass: FoundationBreadcrumb,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleBreadcrumb());
export const breadcrumbTag = 'nimble-breadcrumb';
