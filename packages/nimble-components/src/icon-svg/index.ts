import type { NimbleIcon } from '@ni/nimble-tokens/dist/icons/js';
import { DesignSystem } from '@ni/fast-foundation';
import { template } from './template';
import { styles } from './styles';
import { Icon } from '../icon-base';

/**
 * Icon base class for the standard nimble icon set
 */
export class IconSvg extends Icon {
    public constructor(/** @internal */ public readonly icon: NimbleIcon) {
        super();
    }
}

export const registerIconSvg = (baseName: string, iconClass: typeof IconSvg): void => {
    const composedIcon = iconClass.compose({
        baseName,
        template,
        styles
    });

    DesignSystem.getOrCreate().withPrefix('nimble').register(composedIcon());
};
