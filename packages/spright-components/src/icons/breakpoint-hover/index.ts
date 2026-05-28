import { Icon } from '@ni/nimble-components/dist/esm/icon-base';
import { styles } from '@ni/nimble-components/dist/esm/icon-svg/styles';
import { html } from '@ni/fast-element';
import { DesignSystem } from '@ni/fast-foundation';
import { iconData } from './icon-data';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-breakpoint-hover': IconBreakpointHover;
    }
}

/**
 * Spright breakpoint hover icon.
 */
export class IconBreakpointHover extends Icon {}

const template = html<IconBreakpointHover>`
    <div class="icon" aria-hidden="true" :innerHTML="${() => iconData}"></div>
`;

const sprightIconBreakpointHover = IconBreakpointHover.compose({
    baseName: 'icon-breakpoint-hover',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconBreakpointHover());

export const iconBreakpointHoverTag = 'spright-icon-breakpoint-hover';