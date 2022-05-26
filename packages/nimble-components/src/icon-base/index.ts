import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import type { NimbleIcon } from '@ni/nimble-tokens/dist/icons/js';
import { template } from './template';
import { styles } from './styles';

/**
 * The base class for icon components
 */
export class Icon extends FoundationElement {
    public constructor(public icon: NimbleIcon) {
        super();
    }
}

type IconClass = typeof Icon;

export const registerIcon = (baseName: string, iconClass: IconClass): void => {
    const composedIcon = iconClass.compose({
        baseName,
        template,
        styles,
        baseClass: iconClass
    });

    DesignSystem.getOrCreate().withPrefix('nimble').register(composedIcon());
};
