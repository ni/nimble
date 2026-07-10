import { Icon } from '@ni/nimble-components/dist/esm/icon-base';
import { styles } from '@ni/nimble-components/dist/esm/icon-svg/styles';
import { html } from '@ni/fast-element';
import { DesignSystem } from '@ni/fast-foundation';
import { iconData } from './icon-data';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-breakpoint-disabled': IconBreakpointDisabled;
    }
}

/**
 * Spright breakpoint disabled icon.
 */
export class IconBreakpointDisabled extends Icon {}

const template = html<IconBreakpointDisabled>`
    <div class="icon" aria-hidden="true" :innerHTML="${() => iconData}"></div>
`;

const sprightIconBreakpointDisabled = IconBreakpointDisabled.compose({
    baseName: 'icon-breakpoint-disabled',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconBreakpointDisabled());

export const iconBreakpointDisabledTag = 'spright-icon-breakpoint-disabled';