import {
    DesignSystem,
    Switch as FoundationSwitch,
    SwitchOptions
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

export type { Switch };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-switch': Switch;
    }
}

/**
 * A nimble-styled switch control.
 */
class Switch extends FoundationSwitch {}

const nimbleSwitch = Switch.compose<SwitchOptions>({
    baseClass: FoundationSwitch,
    baseName: 'switch',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSwitch());
