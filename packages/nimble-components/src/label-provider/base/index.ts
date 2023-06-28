import { DesignToken, FoundationElement } from '@microsoft/fast-foundation';
import { Observable, Subscriber } from '@microsoft/fast-element';
import { themeProviderTag } from '../../theme-provider';

/**
 * Base class for label providers
 */
export abstract class LabelProviderBase
    extends FoundationElement
    implements Subscriber {
    protected abstract readonly supportedLabels: {
        [P in keyof LabelProviderBase]?: DesignToken<string>;
    };

    private themeProvider?: HTMLElement;

    public constructor() {
        super();
        Observable.getNotifier(this).subscribe(this);
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.initializeThemeProvider();
    }

    public override disconnectedCallback(): void {
        this.themeProvider = undefined;
    }

    public handleChange(
        _element: LabelProviderBase,
        property: keyof LabelProviderBase
    ): void {
        if (this.supportedLabels[property]) {
            const token = this.supportedLabels[property]!;
            let value = this[property] as string | undefined;
            if (value === undefined) {
                value = token.getValueFor(this);
            }
            token.setValueFor(this, value);
            if (this.themeProvider) {
                token.setValueFor(this.themeProvider, value);
            }
        }
    }

    private initializeThemeProvider(): void {
        this.themeProvider = this.closest(themeProviderTag) ?? undefined;
        if (this.themeProvider) {
            for (const token of Object.values(this.supportedLabels)) {
                const value = token.getValueFor(this);
                token.setValueFor(this.themeProvider, value);
            }
        }
    }
}
