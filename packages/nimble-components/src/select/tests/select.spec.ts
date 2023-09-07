import { html, repeat } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Select, selectTag } from '..';
import { listOptionTag } from '../../list-option';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { SelectPageObject } from '../testing/select.pageobject';

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

describe('Select', () => {
    it('should set classes based on collapsible, open, disabled, and position', async () => {
        const { element, connect, disconnect } = await setup('above', true);

        element.disabled = true;
        element.position = 'above';
        await connect();
        await waitForUpdatesAsync();

        expect(element.classList.contains('collapsible')).toBeTrue();
        expect(element.classList.contains('above')).toBeTrue();
        expect(element.classList.contains('disabled')).toBeTrue();
        expect(element.classList.contains('open')).toBeTrue();

        await disconnect();
    });

    const ariaTestData: {
        attrName: string,
        propSetter: (x: Select, value: string) => void
    }[] = [
        {
            attrName: 'aria-controls',
            propSetter: (x, v) => {
                x.ariaControls = v;
            }
        },
        {
            attrName: 'aria-disabled',
            propSetter: (x, v) => {
                x.ariaDisabled = v;
            }
        },
        {
            attrName: 'aria-expanded',
            propSetter: (x, v) => {
                x.ariaExpanded = v;
            }
        },
        {
            attrName: 'aria-multiselectable',
            propSetter: (x, v) => {
                x.ariaMultiSelectable = v;
            }
        }
    ];
    ariaTestData.forEach(testData => {
        it(`should set ${testData.attrName} from property`, async () => {
            const { element, connect, disconnect } = await setup('above', true);
            await connect();

            testData.propSetter(element, 'foo');
            await waitForUpdatesAsync();
            expect(element.getAttribute(testData.attrName)).toEqual('foo');

            await disconnect();
        });
    });

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
        await waitForUpdatesAsync();

        expect(element.getAttribute('open')).not.toBeNull();
        expect(element.getAttribute('position')).toBe(position);

        await disconnect();
    });

    it('should keep selected value when options change', async () => {
        const { element, connect, disconnect } = await setup();
        const pageObject = new SelectPageObject(element);
        await connect();
        await pageObject.setValue('two');
        expect(element.value).toBe('two');

        // Add option zero at the top of the options list
        // prettier-ignore
        element.insertAdjacentHTML(
            'afterbegin',
            '<nimble-list-option value="zero">Zero</nimble-list-option>'
        );
        await waitForUpdatesAsync();

        expect(element.value).toBe('two');

        await disconnect();
    });

    describe('with 500 options', () => {
        async function setup500Options(): Promise<Fixture<Select>> {
            // prettier-ignore
            const viewTemplate = html`
                <${selectTag}>
                    ${repeat(() => [...Array(500).keys()], html<number>`
                        <nimble-list-option value="${x => x}">${x => x}</nimble-list-option>`)}
                </${selectTag}>
            `;
            return fixture<Select>(viewTemplate);
        }

        it('should limit dropdown height to viewport', async () => {
            const { element, connect, disconnect } = await setup500Options();
            const pageObject = new SelectPageObject(element);
            await connect();
            await pageObject.clickAndWaitForOpen();
            const fullyVisible = await pageObject.isDropdownFullyInViewport();

            expect(element.listbox.scrollHeight).toBeGreaterThan(
                window.innerHeight
            );
            expect(fullyVisible).toBe(true);

            await disconnect();
        });
    });

    describe('within a div', () => {
        async function setupInDiv(): Promise<Fixture<HTMLDivElement>> {
            // prettier-ignore
            const viewTemplate = html`
                <div style="overflow: auto;">
                    <${selectTag}>
                        ${repeat(() => [...Array(5).keys()], html<number>`
                            <${listOptionTag} value="${x => x}">${x => x}</${listOptionTag}>`)}
                    </${selectTag}>
                </div>
            `;
            return fixture<HTMLDivElement>(viewTemplate);
        }

        it('should not confine dropdown to div with "overflow: auto"', async () => {
            const { element, connect, disconnect } = await setupInDiv();
            const select: Select = element.querySelector(selectTag)!;
            const pageObject = new SelectPageObject(select);
            await connect();
            await pageObject.clickAndWaitForOpen();
            const fullyVisible = await pageObject.isDropdownFullyInViewport();

            expect(fullyVisible).toBe(true);

            await disconnect();
        });
    });

    describe('when used with page object', () => {
        async function setupOptions(): Promise<Fixture<Select>> {
            // prettier-ignore
            const viewTemplate = html`
                <${selectTag}>
                    ${repeat(() => [...Array(100).keys()], html<number>`
                        <nimble-list-option value="${x => x}">${x => `  This is item ${x}  `}</nimble-list-option>`)}
                </${selectTag}>
            `;
            return fixture<Select>(viewTemplate);
        }

        it('should allow selecting an item initially visible', async () => {
            const { element, connect, disconnect } = await setupOptions();
            const pageObject = new SelectPageObject(element);
            await connect();
            await pageObject.selectValue('1');
            expect(element.value).toEqual('1');
            await disconnect();
        });

        it('should allow selecting an item initially off screen', async () => {
            const { element, connect, disconnect } = await setupOptions();
            const pageObject = new SelectPageObject(element);
            await connect();
            await pageObject.selectValue('99');
            expect(element.value).toEqual('99');
            await disconnect();
        });

        it('should not change selection when selecting a disabled item', async () => {
            const { element, connect, disconnect } = await setupOptions();
            const pageObject = new SelectPageObject(element);
            await connect();
            pageObject.getOptionWithValue('2')!.disabled = true;
            await pageObject.selectValue('2');
            expect(element.value).toEqual('0');
            await disconnect();
        });

        it('should cause page object to throw when selecting an invalid item', async () => {
            const { element, connect, disconnect } = await setupOptions();
            const pageObject = new SelectPageObject(element);
            await connect();
            await expectAsync(
                pageObject.selectValue('not a value')
            ).toBeRejected();
            await disconnect();
        });

        it('should cause page object to return option count', async () => {
            const { element, connect, disconnect } = await setupOptions();
            const pageObject = new SelectPageObject(element);
            await connect();
            expect(pageObject.getOptionCount()).toEqual(100);
            await disconnect();
        });

        it('should cause page object to return option value', async () => {
            const { element, connect, disconnect } = await setupOptions();
            const pageObject = new SelectPageObject(element);
            await connect();
            expect(pageObject.getOptionValues()[1]).toEqual('1');
            await disconnect();
        });

        it('should cause page object to return trimmed option display value', async () => {
            const { element, connect, disconnect } = await setupOptions();
            const pageObject = new SelectPageObject(element);
            await connect();
            expect(pageObject.getOptionDisplayValues()[1]).toEqual(
                'This is item 1'
            );
            await disconnect();
        });
    });

    it('should export its tag', () => {
        expect(selectTag).toBe('nimble-select');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-select')).toBeInstanceOf(Select);
    });
});
