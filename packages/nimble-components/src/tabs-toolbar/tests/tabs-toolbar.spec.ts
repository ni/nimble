import { TabsToolbar } from '..';

describe('TabsToolbar', () => {
    it('can construct an element instance', () => {
        expect(document.createElement('nimble-tabs-toolbar')).toBeInstanceOf(TabsToolbar);
    });
});
