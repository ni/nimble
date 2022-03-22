import {
    DesignSystem,
    Breadcrumb as FoundationBreadcrumb,
    breadcrumbTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-breadcrumb': Breadcrumb;
    }
}

/**
 * A nimble-styled breadcrumb
 */
export class Breadcrumb extends FoundationBreadcrumb {}

const nimbleBreadcrumb = Breadcrumb.compose({
    baseName: 'breadcrumb',
    baseClass: FoundationBreadcrumb,
    // @ts-expect-error FAST templates have incorrect type, see: https://github.com/microsoft/fast/issues/5047
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleBreadcrumb());
