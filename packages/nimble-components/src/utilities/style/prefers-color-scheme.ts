import { observable } from '@microsoft/fast-element';

export const prefersColorSchemeDarkMediaQuery: MediaQueryList = window.matchMedia(
    '(prefers-color-scheme: dark)'
);

/**
 * It's a class
 */
class PrefersColorScheme {
    @observable
    public prefersDark: boolean = prefersColorSchemeDarkMediaQuery.matches;

    public constructor() {
        prefersColorSchemeDarkMediaQuery.addEventListener('change', () => {
            this.prefersDark = prefersColorSchemeDarkMediaQuery.matches;
        });
    }
}

export const prefersColorScheme = new PrefersColorScheme();
