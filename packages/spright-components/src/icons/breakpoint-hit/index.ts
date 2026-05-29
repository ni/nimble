import { Icon } from '@ni/nimble-components/dist/esm/icon-base';
import { styles } from '@ni/nimble-components/dist/esm/icon-svg/styles';
import { html } from '@ni/fast-element';
import { DesignSystem } from '@ni/fast-foundation';
import { iconData } from './icon-data';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-breakpoint-hit': IconBreakpointHit;
    }
}

/**
 * Spright breakpoint hit icon.
 */
export class IconBreakpointHit extends Icon {}

const template = html<IconBreakpointHit>`
    <div class="icon" aria-hidden="true" :innerHTML="${() => iconData}"></div>
`;

const sprightIconBreakpointHit = IconBreakpointHit.compose({
    baseName: 'icon-breakpoint-hit',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconBreakpointHit());

export const iconBreakpointHitTag = 'spright-icon-breakpoint-hit';