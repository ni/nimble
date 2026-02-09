import { Step, stepTag } from '..';

describe('Step', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(stepTag)).toBeInstanceOf(Step);
    });
});
