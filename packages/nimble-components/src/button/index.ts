import { Button as FoundationButton, buttonTemplate as template, DesignSystem } from '@microsoft/fast-foundation';
import { styles } from './styles';

/**
 * A function that returns a nimble-button registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#buttonTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-button\>
 *
 */
const nimbleButton = FoundationButton.compose({
    baseName: 'button',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleButton());