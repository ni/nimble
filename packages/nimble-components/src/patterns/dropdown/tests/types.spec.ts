import type { DropdownPosition } from '../types';

describe('Dropdown type', () => {
    it('DropdownPosition fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const dropdownPosition: DropdownPosition = 'hello';
        expect(dropdownPosition).toEqual('hello');
    });
});
