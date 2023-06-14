import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import type { TreeItem } from '@ni/nimble-components/dist/esm/tree-item';
import { BooleanValueOrAttribute, toBooleanAriaAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { TreeItem };

/**
 * Directive to provide Angular integration for the tree item.
 */
@Directive({
    selector: 'nimble-tree-item'
})
export class NimbleTreeItemDirective {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get expanded(): boolean {
        return this.elementRef.nativeElement.expanded;
    }

    @Input() public set expanded(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'expanded', toBooleanProperty(value));
    }

    public get selected(): boolean {
        return this.elementRef.nativeElement.selected;
    }

    @Input() public set selected(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'selected', toBooleanProperty(value));
        // Needed because fast-foundation TreeView sets initial selection with an aria-selected query
        this.renderer.setAttribute(this.elementRef.nativeElement, 'selected', toBooleanAriaAttribute(value));
    }

    @Output() public expandedChange = new EventEmitter<boolean>();

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<TreeItem>) {}

    @HostListener('expanded-change', ['$event'])
    public onExpandedChange($event: Event): void {
        if ($event.target === this.elementRef.nativeElement) {
            this.expandedChange.emit(this.expanded);
        }
    }
}
