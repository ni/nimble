import {
    DesignSystem,
    Switch as FoundationSwitch,
    SwitchOptions
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

export const switchTag = 'nimble-switch';
declare global {
    interface HTMLElementTagNameMap {
        [switchTag]: Switch;
    }
}

/**
 * A nimble-styled switch control.
 */
export class Switch extends FoundationSwitch {}

const nimbleSwitch = Switch.compose<SwitchOptions>({
    baseName: switchTag,
    baseClass: FoundationSwitch,
    template,
    styles
});

DesignSystem.getOrCreate().register(nimbleSwitch());