import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    FoundationElementDefinition,
    StartEndOptions
} from '@microsoft/fast-foundation';
import { AnchorBase } from '../anchor-base';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-anchor-tab': AnchorTab;
    }
}

export type TabOptions = FoundationElementDefinition & StartEndOptions;

/**
 * A nimble-styled link tab
 */
export class AnchorTab extends AnchorBase {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled | disabled HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: 'boolean' })
    public disabled = false;
}

const nimbleAnchorTab = AnchorTab.compose({
    baseName: 'anchor-tab',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAnchorTab());
