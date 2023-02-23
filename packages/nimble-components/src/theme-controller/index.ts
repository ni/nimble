import { DesignSystem } from '@microsoft/fast-foundation';
import { Direction } from '@microsoft/fast-web-utilities';
import { template } from './template';
import { styles } from './styles';
import { ThemeBase } from '../theme-base';
import { Theme } from '../theme-provider/types';
import {
    direction,
    directionDefault,
    theme,
    themeDefault
} from '../theme-provider/design-tokens-control';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-theme-controller': ThemeController;
    }
}

/**
 * The ThemeController implementation. Add this component to the page and set its `theme` attribute to control
 * the values of design tokens that provide colors and fonts as CSS custom properties to the root of the page.
 */
export class ThemeController extends ThemeBase {
    public directionChanged(
        _prev: Direction | undefined,
        next: Direction | undefined
    ): void {
        if (next && Direction[next]) {
            direction.withDefault(next);
        } else {
            direction.withDefault(directionDefault);
        }
    }

    public themeChanged(
        _prev: Theme | undefined,
        next: Theme | undefined
    ): void {
        if (next && Theme[next]) {
            theme.withDefault(next);
        } else {
            theme.withDefault(
                // @ts-expect-error See: https://github.com/microsoft/fast/issues/6529
                themeDefault
            );
        }
    }
}

const nimbleDesignSystemProvider = ThemeController.compose({
    baseName: 'theme-controller',
    styles,
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleDesignSystemProvider());
