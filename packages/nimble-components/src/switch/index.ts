import { customElement } from '@ni/fast-element';
import { Switch as FoundationSwitch } from '@ni/fast-foundation';
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
@customElement({
    name: switchTag,
    template,
    styles
})
export class Switch extends FoundationSwitch {}
