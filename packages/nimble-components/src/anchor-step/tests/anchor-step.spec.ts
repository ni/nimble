import { html } from '@ni/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { AnchorStep, anchorStepTag } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { AnchorStepPageObject } from '../testing/anchor-step.pageobject';

async function setup(): Promise<Fixture<AnchorStep>> {
    return await fixture<AnchorStep>(
        html`<${anchorStepTag}></${anchorStepTag}>`
    );
}

describe('AnchorStep', () => {
    let element: AnchorStep;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: AnchorStepPageObject;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new AnchorStepPageObject(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(anchorStepTag)).toBeInstanceOf(
            AnchorStep
        );
    });

    it('should set the "control" class on the internal control', async () => {
        await connect();
        expect(element.control!.classList.contains('control')).toBe(true);
    });

    it('should set the `part` attribute to "control" on the internal control', async () => {
        await connect();
        expect(element.control!.part.contains('control')).toBe(true);
    });

    it('should clear `href` on the internal control when disabled', async () => {
        await connect();
        element.setAttribute('href', 'http://www.ni.com');
        await waitForUpdatesAsync();

        element.disabled = true;
        await waitForUpdatesAsync();

        expect(element.control!.getAttribute('href')).toBeNull();
    });

    const attributeNames = [
        { name: 'download' },
        { name: 'hreflang' },
        { name: 'ping' },
        { name: 'referrerpolicy' },
        { name: 'rel' },
        { name: 'target' },
        { name: 'type' },
        { name: 'aria-atomic' },
        { name: 'aria-busy' },
        { name: 'aria-controls' },
        { name: 'aria-current' },
        { name: 'aria-describedby' },
        { name: 'aria-details' },
        { name: 'aria-disabled' },
        { name: 'aria-errormessage' },
        { name: 'aria-expanded' },
        { name: 'aria-flowto' },
        { name: 'aria-haspopup' },
        { name: 'aria-hidden' },
        { name: 'aria-invalid' },
        { name: 'aria-keyshortcuts' },
        { name: 'aria-label' },
        { name: 'aria-labelledby' },
        { name: 'aria-live' },
        { name: 'aria-owns' },
        { name: 'aria-relevant' },
        { name: 'aria-roledescription' }
    ] as const;
    describe('should reflect value to the internal control', () => {
        parameterizeSpec(attributeNames, (spec, name) => {
            spec(`for attribute ${name}`, async () => {
                await connect();

                element.setAttribute(name, 'foo');
                await waitForUpdatesAsync();

                expect(element.control!.getAttribute(name)).toBe('foo');
            });
        });

        it('for attribute tabindex', async () => {
            await connect();

            element.setAttribute('tabindex', '-1');
            await waitForUpdatesAsync();

            expect(element.control!.getAttribute('tabindex')).toBe('-1');
        });
    });

    it('should clear tabindex attribute from the internal control when cleared from the host', async () => {
        element.setAttribute('tabindex', '-1');
        await connect();

        element.removeAttribute('tabindex');
        await waitForUpdatesAsync();

        expect(element.control!.hasAttribute('tabindex')).toBeFalse();
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
