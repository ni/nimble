import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import type { FvEditCommitBar } from '@ni/ok-components/dist/esm/fv/edit-commit-bar';
import { fvEditCommitBarTag } from '@ni/ok-components/dist/esm/fv/edit-commit-bar';
import type { CommitMessage } from '@ni/ok-components/dist/esm/fv/edit-commit-bar/types';
import { type BooleanValueOrAttribute, type NumberValueOrAttribute, toBooleanProperty, toNumberProperty } from '@ni/nimble-angular/internal-utilities';

export type { CommitMessage, FvEditCommitBar };
export { fvEditCommitBarTag };

/**
 *
 */
/**
 * Angular bindings for edit actions and feedback.
 */
@Directive({
    selector: 'ok-fv-edit-commit-bar',
    standalone: false
})
export class OkFvEditCommitBarDirective {
    @Output() public saveEvent = new EventEmitter<Event>();
    @Output() public revertEvent = new EventEmitter<Event>();
    @Output() public dismissMessage = new EventEmitter<Event>();

    public constructor(
        private readonly elementRef: ElementRef<FvEditCommitBar>,
        private readonly renderer: Renderer2
    ) {}

    public get heading(): string {
        return this.elementRef.nativeElement.heading;
    }

    @Input() public set heading(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'heading', value);
    }

    public get changeCount(): number {
        return this.elementRef.nativeElement.changeCount;
    }

    @Input('change-count') public set changeCount(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'changeCount', toNumberProperty(value));
    }

    public get affectedRowCount(): number {
        return this.elementRef.nativeElement.affectedRowCount;
    }

    @Input('affected-row-count') public set affectedRowCount(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'affectedRowCount', toNumberProperty(value));
    }

    public get hiddenAffectedRowCount(): number {
        return this.elementRef.nativeElement.hiddenAffectedRowCount;
    }

    @Input('hidden-affected-row-count') public set hiddenAffectedRowCount(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'hiddenAffectedRowCount', toNumberProperty(value));
    }

    public get saveDisabled(): boolean {
        return this.elementRef.nativeElement.saveDisabled;
    }

    @Input('save-disabled') public set saveDisabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'saveDisabled', toBooleanProperty(value));
    }

    public get revertDisabled(): boolean {
        return this.elementRef.nativeElement.revertDisabled;
    }

    @Input('revert-disabled') public set revertDisabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'revertDisabled', toBooleanProperty(value));
    }

    public get actionsHidden(): boolean {
        return this.elementRef.nativeElement.actionsHidden;
    }

    @Input('actions-hidden') public set actionsHidden(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'actionsHidden', toBooleanProperty(value));
    }

    public get hideEmptySummary(): boolean {
        return this.elementRef.nativeElement.hideEmptySummary;
    }

    @Input('hide-empty-summary') public set hideEmptySummary(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'hideEmptySummary', toBooleanProperty(value));
    }

    public get message(): CommitMessage | undefined {
        return this.elementRef.nativeElement.message;
    }

    @Input() public set message(value: CommitMessage | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'message', value);
    }

    @HostListener('save', ['$event'])
    public onSave(event: Event): void {
        if (event.target === this.elementRef.nativeElement) {
            this.saveEvent.emit(event);
        }
    }

    @HostListener('revert', ['$event'])
    public onRevert(event: Event): void {
        if (event.target === this.elementRef.nativeElement) {
            this.revertEvent.emit(event);
        }
    }

    @HostListener('dismiss-message', ['$event'])
    public onDismissMessage(event: Event): void {
        if (event.target === this.elementRef.nativeElement) {
            this.dismissMessage.emit(event);
        }
    }
}
