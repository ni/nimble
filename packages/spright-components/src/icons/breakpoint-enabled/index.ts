import { Icon } from '@ni/nimble-components/dist/esm/icon-base';
import { styles } from '@ni/nimble-components/dist/esm/icon-svg/styles';
import { html } from '@ni/fast-element';
import { DesignSystem } from '@ni/fast-foundation';
import { iconData } from './icon-data';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-breakpoint-enabled': IconBreakpointEnabled;
    }
}

/**
 * Spright breakpoint enabled icon.
 */
export class IconBreakpointEnabled extends Icon {}

const template = html<IconBreakpointEnabled>`
    <div class="icon" aria-hidden="true" :innerHTML="${() => iconData}"></div>
`;

const sprightIconBreakpointEnabled = IconBreakpointEnabled.compose({
    baseName: 'icon-breakpoint-enabled',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconBreakpointEnabled());

export const iconBreakpointEnabledTag = 'spright-icon-breakpoint-enabled';