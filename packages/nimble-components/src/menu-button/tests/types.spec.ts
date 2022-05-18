import { MenuButtonPosition } from '../types';

describe('MenuButton type', () => {
    it('MenuButtonPosition fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const position: MenuButtonPosition = 'hello';
        expect(position).toEqual('hello');
    });

    it('MenuButtonPosition fails compile if reassigning items', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        MenuButtonPosition.above = 'hello';
        expect(MenuButtonPosition.above).toEqual('hello');
    });
});
