import { html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Spinner } from '..';

async function setup(): Promise<Fixture<Spinner>> {
    const viewTemplate = html` <nimble-spinner> </nimble-spinner> `;
    return fixture<Spinner>(viewTemplate);
}

describe('Spinner', () => {
    function getAnimatingElements(
        nimbleSpinnerElement: Spinner
    ): HTMLElement[] {
        return Array.from(
            nimbleSpinnerElement.shadowRoot!.querySelectorAll(
                'div.bit1, div.bit2'
            )!
        );
    }

    describe('with default setup', () => {
        let element: Spinner;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('can construct an element instance', () => {
            expect(document.createElement('nimble-spinner')).toBeInstanceOf(
                Spinner
            );
        });

        it('should have size 16x16 by default', () => {
            const spinnerStyle = getComputedStyle(element);
            expect(spinnerStyle.width).toEqual('16px');
            expect(spinnerStyle.height).toEqual('16px');
        });

        it('should initially be animating forever', () => {
            const animatingElements = getAnimatingElements(element);
            expect(animatingElements.length).toBeGreaterThan(0);
            const animatingElementStyles = animatingElements.map(
                animatingElement => getComputedStyle(animatingElement)
            );
            expect(
                animatingElementStyles.every(
                    style => style.animationPlayState === 'running'
                )
            ).toBe(true);
            expect(
                animatingElementStyles.every(
                    style => style.animationIterationCount === 'infinite'
                )
            ).toBe(true);
        });
    });
});
