/* eslint-disable max-classes-per-file */
import { attr } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import type { NimbleIcon } from '@ni/nimble-tokens/dist/icons/js';
import { template } from './template';
import { styles } from './styles';
import type { IconSeverity } from './types';

/**
 * The base class for icon components
 */
export class Icon extends FoundationElement {
    /**
     * @public
     * @remarks
     * HTML Attribute: severity
     */
    @attr
    public severity: IconSeverity;
}

/**
 * Icon base class for the standard nimble icon set
 */
export class SvgIcon extends Icon {
    public constructor(/** @internal */ public readonly icon: NimbleIcon) {
        super();
    }
}

export const registerSvgIcon = (baseName: string, iconClass: typeof SvgIcon): void => {
    const composedIcon = iconClass.compose({
        baseName,
        template,
        styles
    });

    DesignSystem.getOrCreate().withPrefix('nimble').register(composedIcon());
};
