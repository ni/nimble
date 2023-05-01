import { Toolbar, toolbarTag } from '..';

describe('Toolbar', () => {
    it('should export its tag', () => {
        expect(toolbarTag).toBe('nimble-toolbar');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-toolbar')).toBeInstanceOf(
            Toolbar
        );
    });
});
