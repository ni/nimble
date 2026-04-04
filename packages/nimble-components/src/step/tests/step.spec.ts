import { html } from '@ni/fast-element';
import { Step, stepTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { StepPageObject } from '../testing/step.pageobject';

async function setup(): Promise<Fixture<Step>> {
    return await fixture<Step>(
        html`<${stepTag}></${stepTag}>`
    );
}

describe('Step', () => {
    let element: Step;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: StepPageObject;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new StepPageObject(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(stepTag)).toBeInstanceOf(Step);
    });

    it('should default tabIndex on the internal button to 0', async () => {
        await connect();

        const innerStep = element.shadowRoot!.querySelector('button')!;
        expect(innerStep.getAttribute('tabindex')).toBeNull();
        expect(innerStep.tabIndex).toEqual(0);
    });

    it('should set the `tabindex` attribute on the internal button when provided', async () => {
        element.setAttribute('tabindex', '-1');
        await connect();

        const innerStep = element.shadowRoot!.querySelector('button')!;
        expect(innerStep.getAttribute('tabindex')).toEqual('-1');
        expect(innerStep.tabIndex).toEqual(-1);
    });

    it('should clear the `tabindex` attribute on the internal button when cleared from the host', async () => {
        element.setAttribute('tabindex', '-1');
        await connect();

        element.removeAttribute('tabindex');
        await waitForUpdatesAsync();

        const innerStep = element.shadowRoot!.querySelector('button')!;
        expect(innerStep.getAttribute('tabindex')).toBeNull();
        expect(innerStep.tabIndex).toEqual(0);
    });

    describe('click event', () => {
        it('should fire when clicked', async () => {
            const stepClicked = jasmine.createSpy();
            element.addEventListener('click', stepClicked);
            await connect();

            pageObject.click();
            expect(stepClicked.calls.count()).toEqual(1);
        });

        it('should not fire when disabled', async () => {
            const stepClicked = jasmine.createSpy();
            element.addEventListener('click', stepClicked);
            element.disabled = true;
            await connect();

            pageObject.click();
            expect(stepClicked.calls.count()).toEqual(0);
        });

        it('should not fire when readonly', async () => {
            const stepClicked = jasmine.createSpy();
            element.addEventListener('click', stepClicked);
            element.readOnly = true;
            await connect();

            pageObject.click();
            expect(stepClicked.calls.count()).toEqual(0);
        });
    });
});
