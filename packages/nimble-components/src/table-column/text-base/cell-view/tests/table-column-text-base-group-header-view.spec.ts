import { customElement, html, ref } from '@microsoft/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import {
    uniqueElementName,
    type Fixture,
    fixture
} from '../../../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../../../testing/async-helpers';
import { template as textBaseGroupHeaderViewTemplate } from '../template';
import { styles as textBaseGroupHeaderViewStyles } from '../styles';
import { TableColumnTextGroupHeaderViewBase } from '../../group-header-view';
import { ThemeProvider, themeProviderTag } from '../../../../theme-provider';
import {
    LabelProviderTable,
    labelProviderTableTag
} from '../../../../label-provider/table';

describe('TableColumnTextBaseGroupHeaderView', () => {
    let labelProvider: LabelProviderTable;
    let groupHeaderView: TableColumnTextGroupHeaderViewBase;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    const testTextBaseGroupHeaderViewTag = uniqueElementName();
    /**
     * Simple concrete class extending TableColumnTextCellViewBase to use for testing
     */
    @customElement({
        name: testTextBaseGroupHeaderViewTag,
        template: textBaseGroupHeaderViewTemplate,
        styles: textBaseGroupHeaderViewStyles
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class TestTextBaseGroupHeaderView extends TableColumnTextGroupHeaderViewBase {
        protected override updateText(): void {
            this.text = this.groupHeaderValue as string;
        }
    }

    class ElementReferences {
        public labelProvider!: LabelProviderTable;
        public groupView!: TableColumnTextGroupHeaderViewBase;
    }

    async function setup(
        source: ElementReferences
    ): Promise<Fixture<ThemeProvider>> {
        return await fixture<ThemeProvider>(
            html`<${themeProviderTag} lang="en-US">
                    <${labelProviderTableTag} ${ref('labelProvider')}></${labelProviderTableTag}>
                    <${testTextBaseGroupHeaderViewTag} ${ref('groupView')}></${testTextBaseGroupHeaderViewTag}>
                </${themeProviderTag}>`,
            { source }
        );
    }

    function getRenderedText(): string {
        return groupHeaderView
            .shadowRoot!.querySelector('span')!
            .innerText.trim();
    }

    beforeEach(async () => {
        const source = new ElementReferences();
        ({ connect, disconnect } = await setup(source));
        labelProvider = source.labelProvider;
        groupHeaderView = source.groupView;
        await connect();
    });

    afterEach(async () => {
        await disconnect();
    });

    const testCases = [
        {
            name: 'empty string',
            value: '',
            renderedText: 'Empty',
            labelProviderProperty: 'groupRowPlaceholderEmpty'
        },
        {
            name: 'null',
            value: null,
            renderedText: 'No value',
            labelProviderProperty: 'groupRowPlaceholderNoValue'
        },
        {
            name: 'undefined',
            value: undefined,
            renderedText: 'No value',
            labelProviderProperty: 'groupRowPlaceholderNoValue'
        }
    ] as const;

    parameterizeSpec(testCases, (spec, name, value) => {
        spec(
            `uses default label provider string when the value is ${name}`,
            async () => {
                groupHeaderView.groupHeaderValue = value.value;
                await waitForUpdatesAsync();
                expect(getRenderedText()).toBe(value.renderedText);
            }
        );
    });

    parameterizeSpec(testCases, (spec, name, value) => {
        spec(
            `updates group row with modified label provider string when the value is ${name}`,
            async () => {
                const customLabelProviderValue = 'Custom label provider value';
                groupHeaderView.groupHeaderValue = value.value;
                await waitForUpdatesAsync();
                labelProvider[value.labelProviderProperty] = customLabelProviderValue;
                await waitForUpdatesAsync();

                expect(getRenderedText()).toBe(customLabelProviderValue);
            }
        );
    });

    parameterizeSpec(testCases, (spec, name, value) => {
        spec(
            `uses label provider value that was modified while the element was disconnected when the value is ${name}`,
            async () => {
                groupHeaderView.groupHeaderValue = value.value;
                await waitForUpdatesAsync();
                await disconnect();

                const customLabelProviderValue = 'Custom label provider value';
                labelProvider[value.labelProviderProperty] = customLabelProviderValue;

                await connect();
                await waitForUpdatesAsync();

                expect(getRenderedText()).toBe(customLabelProviderValue);
            }
        );
    });
});
