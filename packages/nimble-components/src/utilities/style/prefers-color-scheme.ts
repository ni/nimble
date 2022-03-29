import { observable } from '@microsoft/fast-element';

export const prefersColorSchemeDarkMediaQuery: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

/**
 * It's a class
 */
class PrefersColorScheme {
    @observable
    public dark: boolean = prefersColorSchemeDarkMediaQuery.matches;

    public constructor() {
        prefersColorSchemeDarkMediaQuery.addEventListener('change', () => {
            this.dark = prefersColorSchemeDarkMediaQuery.matches;
        });
    }
}

export const prefersColorScheme = new PrefersColorScheme();
