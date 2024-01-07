import {
    DesignSystem,
    Switch as FoundationSwitch,
    SwitchOptions
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

const baseName = 'switch';
export const switchTag = `nimble-${baseName}`;
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
    baseName,
    baseClass: FoundationSwitch,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSwitch());
