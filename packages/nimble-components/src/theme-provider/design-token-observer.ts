import { CSSDesignToken, DesignToken } from '@microsoft/fast-foundation';

type ExtractDesignTokenValue<U> = U extends CSSDesignToken<infer T> ? T : never;
type SupportedCSSDesignToken = CSSDesignToken<string | boolean | number>;

interface DesignTokenObserverOptions<T> {
    tokens: T;
    target?: HTMLElement;
}
/**
 * Observe changes to design token values
 */
export class DesignTokenObserver <T extends readonly SupportedCSSDesignToken[] | []> {
    public constructor(
        private readonly callback: (values: { -readonly [P in keyof T]: ExtractDesignTokenValue<T[P]> }) => void,
        private readonly options: DesignTokenObserverOptions<T>
    ) {}

    public observe(): void {
        const target = this.options.target ?? document.documentElement;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
        return this.options.tokens.map(token => token.getValueFor(target)) as any;
    }

    public unobserve(): void {

    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const a = async (): Promise<[number, string]> => {
    const b = await Promise.all([Promise.resolve(2), Promise.resolve('hi')]);
    return b;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const c = new DesignTokenObserver(_values => {
}, {
    tokens: [DesignToken.create<string>('a'), DesignToken.create<number>('b')]
});
