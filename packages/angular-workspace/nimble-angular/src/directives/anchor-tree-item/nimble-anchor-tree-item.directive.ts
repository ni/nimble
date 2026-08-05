import { Directive, Input } from '@angular/core';
import { type AnchorTreeItem, anchorTreeItemTag } from '@ni/nimble-components/dist/esm/anchor-tree-item';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';
import { DisableableNimbleAnchorBaseDirective } from '../anchor-base/disableable-nimble-anchor-base.directive';

export type { AnchorTreeItem };
export { anchorTreeItemTag };

/**
 * Directive to provide Angular integration for the anchor tree item.
 */
@Directive({
    selector: 'nimble-anchor-tree-item',
    standalone: false
})
export class NimbleAnchorTreeItemDirective extends DisableableNimbleAnchorBaseDirective<AnchorTreeItem> {
    public get selected(): boolean {
        return this.elementRef.nativeElement.selected;
    }

    @Input() public set selected(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'selected', toBooleanProperty(value));
    }
}
