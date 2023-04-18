import { attr, observable } from '@microsoft/fast-element';
import { Checkbox, DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import type { TableColumn } from '../../../table-column/base';
import { styles } from './styles';
import { template } from './template';
import {
    TableRowSelectionState,
    TableRowSelectionToggleEventDetail
} from '../../types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-group-row': TableGroupRow;
    }
}

/**
 * A styled cell that is used within the nimble-table-row.
 * @internal
 */
export class TableGroupRow extends FoundationElement {
    @observable
    public groupRowValue?: unknown;

    @observable
    public nestingLevel = 0;

    @observable
    public leafItemCount?: number;

    @observable
    public groupColumn?: TableColumn;

    @attr({ mode: 'boolean' })
    public expanded = false;

    @attr({ mode: 'boolean' })
    public selectable = false;

    @attr({ attribute: 'selection-state' })
    public selectionState: TableRowSelectionState = TableRowSelectionState.notSelected;

    /**
     * @internal
     */
    public readonly expandIcon!: HTMLElement;/**

    * @internal
    */
    @observable
    public readonly selectionCheckbox?: Checkbox;

    /**
     * @internal
     */
    @observable
    public animationClass = '';

    // Programmatically updating the selection state of a checkbox fires the 'change' event.
    // Therefore, selection change events that occur due to programmatically updating
    // the selection checkbox 'checked' value should be ingored.
    // https://github.com/microsoft/fast/issues/5750
    private ignoreSelectionChangeEvents = false;

    public onGroupExpandToggle(): void {
        this.$emit('group-expand-toggle');
        // To avoid a visual glitch with improper expand/collapse icons performing an
        // animation, we apply a class to the appropriate group row such that we can have
        // a more targeted CSS animation. We use the 'transitionend' event to remove the
        // temporary class and register a function reference as the handler to avoid issues
        // that may result from the 'transitionend' event not firing, as it will never result
        // in multiple event listeners being registered.
        this.animationClass = 'animating';
        this.expandIcon.addEventListener(
            'transitionend',
            this.removeAnimatingClass
        );
    }

    /** @internal */
    public onSelectionCheckboxClick(event: MouseEvent): void {
        event.stopImmediatePropagation();

        const wasSelected = this.selectionState === TableRowSelectionState.selected;
        const detail: TableRowSelectionToggleEventDetail = {
            oldState: wasSelected,
            newState: !wasSelected
        };
        this.$emit('group-selection-toggle', detail);
    }

    /** @internal */
    public onSelectionChange(event: CustomEvent): void {
        if (this.ignoreSelectionChangeEvents) {
            return;
        }

        const checkbox = event.target as Checkbox;
        const checked = checkbox.checked;
        this.selectionState = checked ? TableRowSelectionState.selected : TableRowSelectionState.notSelected;
        const detail: TableRowSelectionToggleEventDetail = {
            oldState: !checked,
            newState: checked
        };
        this.$emit('group-selection-toggle', detail);
    }

    private selectionStateChanged(): void {
        this.setSelectionCheckboxState();
    }

    private selectionCheckboxChanged(): void {
        this.setSelectionCheckboxState();
    }

    private setSelectionCheckboxState(): void {
        if (this.selectionCheckbox) {
            this.ignoreSelectionChangeEvents = true;
            this.selectionCheckbox.checked = this.selectionState === TableRowSelectionState.selected;
            this.selectionCheckbox.indeterminate = this.selectionState
                === TableRowSelectionState.partiallySelected;
            this.ignoreSelectionChangeEvents = false;
        }
    }

    private readonly removeAnimatingClass = (): void => {
        this.animationClass = '';
        this.expandIcon.removeEventListener(
            'transitionend',
            this.removeAnimatingClass
        );
    };
}

const nimbleTableGroupRow = TableGroupRow.compose({
    baseName: 'table-group-row',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableGroupRow());
export const tableGroupRowTag = DesignSystem.tagFor(TableGroupRow);
