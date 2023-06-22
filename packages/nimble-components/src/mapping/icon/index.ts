import { attr, observable } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { Mapping } from '../base';
import { template } from '../base/template';
import type { IconSeverity } from '../../icon-base/types';
import { Icon } from '../../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-icon': MappingIcon;
    }
}

const isIcon = (elementName: string): boolean => {
    const klass = customElements.get(elementName);
    return klass !== undefined && (klass.prototype instanceof Icon);
};

/**
 * Maps values to an icon.
 */
export class MappingIcon extends Mapping {
    @attr()
    public icon?: string;

    @attr()
    public severity: IconSeverity;

    @attr()
    public label?: string;

    /**
     * @internal
     */
    @observable
    public resolvedIcon?: string;

    private async waitForIcon(iconToWaitFor: string): Promise<void> {
        try {
            await customElements.whenDefined(iconToWaitFor);
            // Possible the target icon has changed while waiting for registration
            if (iconToWaitFor === this.icon && isIcon(iconToWaitFor)) {
                this.resolvedIcon = iconToWaitFor;
            }
        } catch (ex) {
            // Ignore error, i.e. invalid custom element name
        }
    }

    private iconChanged(): void {
        if (typeof this.icon === 'string') {
            if (customElements.get(this.icon)) {
                if (isIcon(this.icon)) {
                    this.resolvedIcon = this.icon;
                } else {
                    this.resolvedIcon = undefined;
                }
            } else {
                void this.waitForIcon(this.icon);
            }
        } else {
            this.resolvedIcon = undefined;
        }
    }
}

const iconMapping = MappingIcon.compose({
    baseName: 'mapping-icon',
    template
});
DesignSystem.getOrCreate().withPrefix('nimble').register(iconMapping());
export const mappingIconTag = DesignSystem.tagFor(MappingIcon);
