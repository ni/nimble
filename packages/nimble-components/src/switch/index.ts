import {
    DesignSystem,
    Switch as FoundationSwitch,
    type SwitchOptions
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-switch': Switch;
    }
}

/**
 * A nimble-styled switch control.
 */
export class Switch extends FoundationSwitch {}

const nimbleSwitch = Switch.compose<SwitchOptions>({
    baseName: 'switch',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSwitch());
export const switchTag = 'nimble-switch';
