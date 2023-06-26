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

const isIconClass = (elementClass: CustomElementConstructor): boolean => {
    return elementClass !== undefined && (elementClass.prototype instanceof Icon);
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
     * Calculated asynchronously by the icon mapping based on the configured icon value
     * When assigned it corresponds to an element name that is resolved to type of Nimble Icon
     */
    @observable
    public resolvedIcon?: string;

    // Allow icons to be defined asynchronously from when the property is configured
    private async resolveIconAsync(icon: string): Promise<void> {
        try {
            await customElements.whenDefined(icon);
        } catch (ex) {
            // If any error (i.e. invalid custom element name) don't continue
            // Don't update the resolvedIcon as it was already set to undefined before async resolution
            // (in-case other async resolutions were started)
            return;
        }

        const elementClass = customElements.get(icon)!;
        if (icon !== this.icon) {
            // Possible the icon has changed while waiting for async resolution
            // Don't update the resolvedIcon as it was already set to undefined before async resolution
            // (in-case other async resolutions were started)
            return;
        }

        this.resolvedIcon = isIconClass(elementClass) ? icon : undefined;
    }

    private iconChanged(): void {
        const icon = this.icon;
        if (typeof icon !== 'string') {
            this.resolvedIcon = undefined;
            return;
        }
        const elementClass = customElements.get(icon);
        if (elementClass !== undefined) {
            this.resolvedIcon = isIconClass(elementClass) ? icon : undefined;
            return;
        }
        // Clear the current resolution while waiting for async resolution
        this.resolvedIcon = undefined;
        void this.resolveIconAsync(icon);
    }
}

const iconMapping = MappingIcon.compose({
    baseName: 'mapping-icon',
    template
});
DesignSystem.getOrCreate().withPrefix('nimble').register(iconMapping());
export const mappingIconTag = DesignSystem.tagFor(MappingIcon);
