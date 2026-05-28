import { Icon } from '@ni/nimble-components/dist/esm/icon-base';
import { styles } from '@ni/nimble-components/dist/esm/icon-svg/styles';
import { html } from '@ni/fast-element';
import { DesignSystem } from '@ni/fast-foundation';
import { iconData } from './icon-data';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-breakpoint-hit-disabled': IconBreakpointHitDisabled;
    }
}

/**
 * Spright breakpoint hit disabled icon.
 */
export class IconBreakpointHitDisabled extends Icon {}

const template = html<IconBreakpointHitDisabled>`
    <div class="icon" aria-hidden="true" :innerHTML="${() => iconData}"></div>
`;

const sprightIconBreakpointHitDisabled = IconBreakpointHitDisabled.compose({
    baseName: 'icon-breakpoint-hit-disabled',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconBreakpointHitDisabled());

export const iconBreakpointHitDisabledTag = 'spright-icon-breakpoint-hit-disabled';