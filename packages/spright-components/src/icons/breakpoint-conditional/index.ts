import { Icon } from '@ni/nimble-components/dist/esm/icon-base';
import { styles } from '@ni/nimble-components/dist/esm/icon-svg/styles';
import { html } from '@ni/fast-element';
import { DesignSystem } from '@ni/fast-foundation';
import { iconData } from './icon-data';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-breakpoint-conditional': IconBreakpointConditional;
    }
}

/**
 * Spright breakpoint conditional icon.
 */
export class IconBreakpointConditional extends Icon {}

const template = html<IconBreakpointConditional>`
    <div class="icon" aria-hidden="true" :innerHTML="${() => iconData}"></div>
`;

const sprightIconBreakpointConditional = IconBreakpointConditional.compose({
    baseName: 'icon-breakpoint-conditional',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconBreakpointConditional());

export const iconBreakpointConditionalTag = 'spright-icon-breakpoint-conditional';