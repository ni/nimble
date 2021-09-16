import {
    treeItemTemplate as template,
    TreeItem,
    TreeItemOptions,
    DesignSystem
} from '@microsoft/fast-foundation';
import { upArrow16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

/**
 * A function that returns a nimble-tree-item registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#treeItemTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-tree-item\>
 *
 */
export const nimbleTreeItem = TreeItem.compose<TreeItemOptions>({
    baseName: 'tree-item',
    template,
    styles,
    expandCollapseGlyph: `${upArrow16X16.data}`
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTreeItem());
