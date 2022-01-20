import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { Direction } from '@microsoft/fast-web-utilities';
import { template } from './template';
import { styles } from './styles';
import { direction, theme } from './design-tokens';
import { NimbleTheme } from './types';

export type { NimbleThemeProvider };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-theme-provider': NimbleThemeProvider;
    }
}

/**
 * The NimbleThemeProvider implementation. Add this component to the page and set its `theme` attribute to control
 * the values of design tokens that provide colors and fonts as CSS custom properties to any descendant components.
 * @internal
 */
class NimbleThemeProvider extends FoundationElement {
    @attr({
        attribute: 'direction'
    })
    public direction!: Direction;

    @attr({
        attribute: 'theme'
    })
    public theme!: NimbleTheme;

    public directionChanged(
        _prev: Direction | undefined,
        next: Direction | undefined
    ): void {
        if (next !== undefined && next !== null) {
            direction.setValueFor(this, next);
        } else {
            direction.deleteValueFor(this);
        }
    }

    public themeChanged(
        _prev: NimbleTheme | undefined,
        next: NimbleTheme | undefined
    ): void {
        if (next !== undefined && next !== null) {
            theme.setValueFor(this, next);
        } else {
            theme.deleteValueFor(this);
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();

        if (!this.direction) {
            this.direction = Direction.ltr;
        }

        if (!this.theme) {
            this.theme = NimbleTheme.Light;
        }
    }
}

const nimbleDesignSystemProvider = NimbleThemeProvider.compose({
    baseName: 'theme-provider',
    styles,
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleDesignSystemProvider());
