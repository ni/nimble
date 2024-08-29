import { attr, observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import type { TableColumn } from '../../../table-column/base';
import { styles } from './styles';
import { template } from './template';
import {
    TableRowFocusableElements,
    TableRowSelectionState,
    TableRowSelectionToggleEventDetail
} from '../../types';
import type { Checkbox } from '../../../checkbox';

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

    /**
     * Row index in the flattened set of all regular and group header rows.
     * Represents the index in table.tableData (TableRowState[]).
     */
    @observable
    public resolvedRowIndex?: number;

    @observable
    public immediateChildCount?: number;

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
    public readonly expandIcon!: HTMLElement;

    /**
     * @internal
     */
    @observable
    public readonly selectionCheckbox?: Checkbox;

    /**
     * @internal
     */
    @observable
    public animationClass = '';

    /**
     * @internal
     */
    @attr({ attribute: 'allow-hover-styling', mode: 'boolean' })
    public allowHoverStyling = true;

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
    public onSelectionCheckboxChange(event: CustomEvent): void {
        if (this.ignoreSelectionChangeEvents) {
            return;
        }

        const checkbox = event.target as Checkbox;
        const checked = checkbox.checked;
        this.selectionState = checked
            ? TableRowSelectionState.selected
            : TableRowSelectionState.notSelected;
        const detail: TableRowSelectionToggleEventDetail = {
            oldState: !checked,
            newState: checked
        };
        this.$emit('group-selection-toggle', detail);
    }

    /** @internal */
    public getFocusableElements(): TableRowFocusableElements {
        return {
            selectionCheckbox: this.selectable
                ? this.selectionCheckbox
                : undefined,
            cells: []
        };
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
export const tableGroupRowTag = 'nimble-table-group-row';
