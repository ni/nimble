import {
    DesignSystem,
    Select as FoundationSelect
} from '@microsoft/fast-foundation';
import { DOM, html, repeat } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Select } from '..';
import '../../list-option';

async function setup(
    position?: string,
    open?: boolean
): Promise<Fixture<Select>> {
    const viewTemplate = html`
        <nimble-select
            ${position !== undefined ? `position="${position}"` : ''}
            ${open ? 'open' : ''}
        >
            <nimble-list-option value="one">One</nimble-list-option>
            <nimble-list-option value="two">Two</nimble-list-option>
            <nimble-list-option value="three">Three</nimble-list-option>
        </nimble-select>
    `;
    return fixture<Select>(viewTemplate);
}

async function clickAndWaitForOpen(select: Select): Promise<void> {
    select.click();
    // Takes two updates for listbox to be rendered
    await DOM.nextUpdate();
    await DOM.nextUpdate();
}

async function checkFullyInViewport(element: HTMLElement): Promise<boolean> {
    return new Promise((resolve, _reject) => {
        const intersectionObserver = new IntersectionObserver(
            entries => {
                intersectionObserver.disconnect();
                if (
                    entries[0]?.isIntersecting
                    && entries[0].intersectionRatio === 1.0
                ) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            },
            { threshold: 1.0 }
        );
        intersectionObserver.observe(element);
    });
}

describe('Select', () => {
    it('should respect value set before connect is completed', async () => {
        const { element, connect, disconnect } = await setup();

        const connectTask = connect();
        element.value = 'two';
        await connectTask;

        expect(element.value).toBe('two');

        await disconnect();
    });

    it('should respect "open" and "position" attributes when both set', async () => {
        const position = 'above';
        const { element, connect, disconnect } = await setup(position, true);

        await connect();
        await DOM.nextUpdate();

        expect(element.getAttribute('open')).not.toBeNull();
        expect(element.getAttribute('position')).toBe(position);

        await disconnect();
    });

    it('should keep selected value when options change', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        element.value = 'two';
        await DOM.nextUpdate();
        expect(element.value).toBe('two');

        // Add option zero at the top of the options list
        // prettier-ignore
        element.insertAdjacentHTML(
            'afterbegin',
            '<nimble-list-option value="zero">Zero</nimble-list-option>'
        );
        await DOM.nextUpdate();

        expect(element.value).toBe('two');

        await disconnect();
    });

    describe('with 500 options', () => {
        async function setup500Options(): Promise<Fixture<Select>> {
            // prettier-ignore
            const viewTemplate = html`
                <nimble-select>
                    ${repeat(() => [...Array(500).keys()], html<number>`
                        <nimble-list-option value="${x => x}">${x => x}</nimble-list-option>`)}
                </nimble-select>
            `;
            return fixture<Select>(viewTemplate);
        }

        it('should limit dropdown height to viewport', async () => {
            const { element, connect, disconnect } = await setup500Options();
            await connect();
            const listbox: HTMLElement = element.shadowRoot!.querySelector('.listbox')!;
            await clickAndWaitForOpen(element);
            // The test is run in an iframe, and the containing window has a Karma header.
            // It seems the window is sized without accounting for the header, so a header-height's
            // worth of content is scrolled out of view. The approach we take with the
            // IntersectionObserver only works if the full iframe is visible, so we scroll the
            // containing window to the bottom (i.e. scrolling the Karma header out of view and
            // the bottom of the iframe into view).
            window.parent.scrollTo(0, window.parent.document.body.scrollHeight);
            const fullyVisible = await checkFullyInViewport(listbox);

            expect(listbox.scrollHeight).toBeGreaterThan(window.innerHeight);
            expect(fullyVisible).toBe(true);

            await disconnect();
        });
    });

    it('should have its tag returned by tagFor(FoundationSelect)', () => {
        expect(DesignSystem.tagFor(FoundationSelect)).toBe('nimble-select');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-select')).toBeInstanceOf(Select);
    });
});
