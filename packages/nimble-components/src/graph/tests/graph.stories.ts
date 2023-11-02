import { html, ref } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { ExampleDataType } from './types';
import {
    addLabelUseMetadata,
    type LabelUserArgs
} from '../../label-provider/base/tests/label-user-stories-utils';
import { labelProviderTableTag } from '../../label-provider/table';
import { graphTag, type Graph } from '..';

interface GraphArgs extends LabelUserArgs {
    data: ExampleDataType;
    graphRef: Graph;
    updateData: (args: GraphArgs) => void;
}

const singlePlot = [
    {
        x: [0, 1, 2, 3, 4, 5],
        y: [0, 1, 2, 3, 4, 5]
    }
];

const plotXData1 = [];
const plotYData1 = [];
const plotYData2 = [];
for (let i = 0; i < 10; i++) {
    plotXData1.push(i);
    plotYData1.push(Math.random() * 10);
    plotYData2.push(Math.random() * 10 + 2);
}

const multiPlot = [
    {
        x: plotXData1,
        y: plotYData1
    },
    {
        x: plotXData1,
        y: plotYData2
    }
];

const dataSets = {
    [ExampleDataType.singlePlot]: singlePlot,
    [ExampleDataType.multiPlot]: multiPlot
};

const metadata: Meta<GraphArgs> = {
    title: 'Components/Graph',
    decorators: [withActions],
    // prettier-ignore
    render: createUserSelectedThemeStory(html<GraphArgs>`
        <${graphTag}
            ${ref('graphRef')}
            data-unused="${x => x.updateData(x)}"
        >
        </${graphTag}>
    `),
    argTypes: {
        data: {
            name: 'setData(data)',
            options: Object.values(ExampleDataType),
            control: {
                type: 'radio',
                labels: {
                    [ExampleDataType.singlePlot]: 'Single plot',
                    [ExampleDataType.multiPlot]: 'Multi plot'
                }
            }
        },
        graphRef: {
            graph: {
                disable: true
            }
        },
        updateData: {
            table: {
                disable: true
            }
        }
    },
    args: {
        data: ExampleDataType.singlePlot,
        graphRef: undefined,
        updateData: x => {
            void (async () => {
                // Safari workaround: the table element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                await customElements.whenDefined('nimble-graph');
                await x.graphRef.setData(dataSets[x.data]);
            })();
        }
    }
};
addLabelUseMetadata(metadata, labelProviderTableTag);

export default metadata;

export const graph: StoryObj<GraphArgs> = {};
