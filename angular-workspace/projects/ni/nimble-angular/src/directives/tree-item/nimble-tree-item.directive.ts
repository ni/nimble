import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { TreeItem } from '@ni/nimble-components/dist/esm/tree-item';
import { toBooleanAriaAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

export type { TreeItem };

/**
 * Directive to provide Angular integration for the tree item.
 */
@Directive({
    selector: 'nimble-tree-item'
})
export class NimbleTreeItemDirective {
    public get disabled(): boolean {
        return this.el.nativeElement.disabled;
    }

    @Input() public set disabled(value: boolean) {
        this.renderer.setProperty(this.el.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get expanded(): boolean {
        return this.el.nativeElement.expanded;
    }

    @Input() public set expanded(value: boolean) {
        this.renderer.setProperty(this.el.nativeElement, 'expanded', toBooleanProperty(value));
    }

    public get selected(): boolean {
        return this.el.nativeElement.selected;
    }

    @Input() public set selected(value: boolean) {
        this.renderer.setProperty(this.el.nativeElement, 'selected', toBooleanProperty(value));
        // Needed because fast-foundation TreeView sets initial selection with an aria-selected query
        this.renderer.setAttribute(this.el.nativeElement, 'selected', toBooleanAriaAttribute(value));
    }

    @Output() public expandedChange = new EventEmitter<boolean>();

    public constructor(private readonly renderer: Renderer2, private readonly el: ElementRef<TreeItem>) {}

    @HostListener('expanded-change', ['$event'])
    private onExpandedChange($event: Event): void {
        if ($event.target === this.el.nativeElement) {
            this.expandedChange.emit(this.expanded);
        }
    }
}
