import { Rectangle, rectangleTag } from '..';

describe('Rectangle', () => {
    it('should export its tag', () => {
        expect(rectangleTag).toBe('spright-rectangle');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('spright-rectangle')).toBeInstanceOf(
            Rectangle
        );
    });
});
