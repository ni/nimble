import { Demo, demoTag } from '..';

describe('Demo', () => {
    it('should export its tag', () => {
        expect(demoTag).toBe('spright-demo');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('spright-demo')).toBeInstanceOf(Demo);
    });
});
