import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-toolbar': FvToolbar;
    }
}

/**
 * A simple layout toolbar with a left primary slot and right-aligned end slot content.
 */
export class FvToolbar extends FoundationElement {}

const okFvToolbar = FvToolbar.compose({
    baseName: 'fv-toolbar',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvToolbar());
export const fvToolbarTag = 'ok-fv-toolbar';