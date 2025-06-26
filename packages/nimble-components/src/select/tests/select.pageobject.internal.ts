import type { Select } from '..';
import {
    listOptionGroupTag,
    type ListOptionGroup
} from '../../list-option-group';
import { SelectPageObject } from '../testing/select.pageobject';

/**
 * Page object for the `nimble-select` component to provide consistent ways
 * of querying and interacting with the component during tests.
 *
 * @remarks
 * This page object is intended for internal use only and should not be exported.
 */
export class SelectPageObjectInternal extends SelectPageObject {
    public constructor(selectElement: Select) {
        super(selectElement);
    }

    public getAllGroups(): ListOptionGroup[] {
        return Array.from(
            this.selectElement.querySelectorAll<ListOptionGroup>(
                listOptionGroupTag
            )
        );
    }

    public getGroupLabel(index: number): string {
        return this.getGroup(index).label ?? '';
    }

    public clickGroup(index: number): void {
        this.getGroup(index).labelSlot.click();
    }

    public getGroup(index: number): ListOptionGroup {
        const group = this.selectElement.querySelectorAll<ListOptionGroup>(
            listOptionGroupTag
        )[index];
        if (!group) {
            throw new Error(`Group at index ${index} not found`);
        }

        return group;
    }

    public getDropdownVisibleElements(): HTMLElement[] {
        return Array.from(
            this.selectElement.querySelectorAll<HTMLElement>(
                ':not([visually-hidden])'
            )
        );
    }
}
