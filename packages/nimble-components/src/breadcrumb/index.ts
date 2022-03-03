import {
    DesignSystem,
    Breadcrumb as FoundationBreadcrumb,
    breadcrumbTemplate as template
} from '@microsoft/fast-foundation';
import {
    breadcrumb2FontColor,
    breadcrumbActiveFontColor,
    getBreadcrumb2FontColorForTheme,
    getBreadcrumbActiveFontColorForTheme,
    styles
} from './styles';

export type { Breadcrumb };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-breadcrumb': Breadcrumb;
    }
}

/**
 * A nimble-styled breadcrumb
 */
class Breadcrumb extends FoundationBreadcrumb {
    public constructor() {
        super();
        breadcrumbActiveFontColor.setValueFor(
            this,
            getBreadcrumbActiveFontColorForTheme
        );
        breadcrumb2FontColor.setValueFor(this, getBreadcrumb2FontColorForTheme);
    }
}

const nimbleBreadcrumb = Breadcrumb.compose({
    baseName: 'breadcrumb',
    baseClass: FoundationBreadcrumb,
    // @ts-expect-error FAST templates have incorrect type, see: https://github.com/microsoft/fast/issues/5047
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleBreadcrumb());
