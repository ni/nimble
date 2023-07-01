import {
    DesignToken,
    DesignTokenChangeRecord,
    FoundationElement
} from '@microsoft/fast-foundation';
import { Observable, type Subscriber } from '@microsoft/fast-element';
import { themeProviderTag } from '../../theme-provider';

type LabelTokenCollection = {
    [P in keyof LabelProviderBase]?: DesignToken<string>;
};

/**
 * Base class for label providers
 */
export abstract class LabelProviderBase
    extends FoundationElement
    implements Subscriber {
    protected readonly supportedLabels: LabelTokenCollection;

    private themeProvider?: HTMLElement;
    private suppressChangesForToken?: DesignToken<string>;

    public constructor(supportedLabels: LabelTokenCollection) {
        super();

        if (supportedLabels === undefined) {
            throw new Error('supportedLabels constructor argument is required');
        }
        this.supportedLabels = supportedLabels;
        Observable.getNotifier(this).subscribe(this);
        for (const token of Object.values(supportedLabels)) {
            token.subscribe(
                {
                    handleChange: (
                        record: DesignTokenChangeRecord<DesignToken<string>>
                    ) => {
                        this.handleDesignTokenChange(record.token);
                    }
                },
                this
            );
        }
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.initializeThemeProvider();
    }

    public override disconnectedCallback(): void {
        this.themeProvider = undefined;
    }

    public handleDesignTokenChange(token: DesignToken<string>): void {
        if (token !== this.suppressChangesForToken && this.themeProvider) {
            token.setValueFor(this.themeProvider, token.getValueFor(this));
        }
    }

    public handleChange(
        _element: LabelProviderBase,
        property: keyof LabelProviderBase
    ): void {
        if (this.supportedLabels[property]) {
            const token = this.supportedLabels[property]!;
            const value = this[property] as string | undefined | null;
            if (value !== undefined && value !== null) {
                token.setValueFor(this, value);
            } else {
                this.suppressChangesForToken = token;
                token.deleteValueFor(this);
                if (this.themeProvider) {
                    token.deleteValueFor(this.themeProvider);
                }
                this.suppressChangesForToken = undefined;
            }
        }
    }

    private initializeThemeProvider(): void {
        this.themeProvider = this.closest(themeProviderTag) ?? undefined;
        if (this.themeProvider) {
            for (const [property, token] of Object.entries(
                this.supportedLabels
            ) as [keyof LabelProviderBase, DesignToken<string>][]) {
                const propertyValue = this[property] as
                    | string
                    | null
                    | undefined;
                if (propertyValue !== null && propertyValue !== undefined) {
                    const value = token.getValueFor(this);
                    token.setValueFor(this.themeProvider, value);
                }
            }
        }
    }
}
