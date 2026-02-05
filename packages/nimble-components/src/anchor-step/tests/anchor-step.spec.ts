import { AnchorStep, anchorStepTag } from '..';

describe('Anchor Step', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(anchorStepTag)).toBeInstanceOf(AnchorStep);
    });
});
