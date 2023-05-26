import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { AnchorTreeItem } from '@ni/nimble-components/dist/esm/anchor-tree-item';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleAnchorBaseDirective } from '../anchor-base/nimble-anchor-base.directive';

export type { AnchorTreeItem };

/**
 * Directive to provide Angular integration for the anchor tree item.
 */
@Directive({
    selector: 'nimble-anchor-tree-item'
})
export class NimbleAnchorTreeItemDirective extends NimbleAnchorBaseDirective<AnchorTreeItem> {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get selected(): boolean {
        return this.elementRef.nativeElement.selected;
    }

    @Input() public set selected(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'selected', toBooleanProperty(value));
    }

    public constructor(renderer: Renderer2, elementRef: ElementRef<AnchorTreeItem>) {
        super(renderer, elementRef);
    }
}
