  
import { treeViewTemplate as template, TreeView, DesignSystem } from "@microsoft/fast-foundation";
import { styles } from "./styles";

/**
 * A function that returns a nimble-tree-view registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#treeViewTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-tree-view\>
 *
 */
export const nimbleTreeView = TreeView.compose({
    baseName: "tree-view",
    template,
    styles,
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTreeView());