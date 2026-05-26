import { Icon } from '@ni/nimble-components/dist/esm/icon-base';
import { styles } from '@ni/nimble-components/dist/esm/icon-svg/styles';
import { html } from '@ni/fast-element';
import { DesignSystem } from '@ni/fast-foundation';
import { iconData } from './icon-data';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-breakpoint-execution-pointer': IconBreakpointExecutionPointer;
    }
}

/**
 * Spright breakpoint execution pointer icon.
 */
export class IconBreakpointExecutionPointer extends Icon {}

const template = html<IconBreakpointExecutionPointer>`
    <div class="icon" aria-hidden="true" :innerHTML="${() => iconData}"></div>
`;

const sprightIconBreakpointExecutionPointer = IconBreakpointExecutionPointer.compose({
    baseName: 'icon-breakpoint-execution-pointer',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconBreakpointExecutionPointer());

export const iconBreakpointExecutionPointerTag = 'spright-icon-breakpoint-execution-pointer';