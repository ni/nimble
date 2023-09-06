import { Button, buttonTag } from '..';

describe('Button', () => {
    it('should export its tag', () => {
        expect(buttonTag).toBe('nimble-button');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-button')).toBeInstanceOf(Button);
    });
});
