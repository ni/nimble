import { Toolbar, toolbarTag } from '..';

describe('Toolbar', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(toolbarTag)).toBeInstanceOf(Toolbar);
    });
});
