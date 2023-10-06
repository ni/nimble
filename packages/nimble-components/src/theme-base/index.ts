import { FoundationElement } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import type { Direction } from '@microsoft/fast-web-utilities';
import type { Theme } from '../theme-provider/types';
import type { ValidityObject } from '../utilities/models/validator';

/**
 * The ThemeProvider implementation. Add this component to the page and set its `theme` attribute to control
 * the values of design tokens that provide colors and fonts as CSS custom properties to any descendant components.
 */
export abstract class ThemeBase extends FoundationElement {
    @attr()
    public override lang!: string;

    @attr()
    public override dir!: Direction;

    @attr()
    public theme?: Theme;

    public get validity(): ValidityObject {
        return {
            invalidLang: this.langIsInvalid
        };
    }

    protected langIsInvalid = false;

    public checkValidity(): boolean {
        return !this.langIsInvalid;
    }

    protected abstract dirChanged(
        _prev: Direction | undefined | null,
        next: Direction | undefined | null
    ): void;

    protected abstract themeChanged(
        _prev: Theme | undefined | null,
        next: Theme | undefined | null
    ): void;

    protected abstract langChanged(
        _prev: string | undefined | null,
        next: string | undefined | null
    ): void;
}
