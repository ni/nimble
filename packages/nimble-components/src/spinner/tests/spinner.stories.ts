import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { SpinnerSize } from '../types';

interface SpinnerArgs {
    size: keyof typeof SpinnerSize;
}

const overviewText = '<p>The `nimble-spinner` is an animating indicator that can be placed in a particular region of a page to represent '
    + 'loading progress, or an ongoing operation, of an indeterminate / unknown duration.</p>'
    + '<p>Supported sizes:'
    + '<ul>'
    + '<li>16x16 (default). Example usages: Alongside inline text, or small controls like checkboxes; in a table control row/cell.</li>'
    + '<li>32x32</li>'
    + '<li>64x64. Example usage: For loading progress of components taking up a large percentage of a page.</li>'
    + '</ul>'
    + 'The spinner will also scale appropriately if its width/ height are overriden via CSS styles, for advanced use cases.';

const metadata: Meta<SpinnerArgs> = {
    title: 'Spinner',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/dece308f-79e7-48ec-ab41-011f3376b49b/specs/'
        }
    },
    argTypes: {
        size: {
            description: 'Size of the spinner',
            options: Object.keys(SpinnerSize),
            table: { defaultValue: { summary: '16x16' } },
            control: {
                type: 'radio',
                labels: {
                    default: '16x16 (small, default)',
                    [SpinnerSize.medium]: '32x32 (medium)',
                    [SpinnerSize.large]: '64x64 (large)'
                }
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-spinner
            size="${x => SpinnerSize[x.size]}"
        >
        </nimble-spinner>
    `),
    args: {
        size: 'default'
    }
};

export default metadata;

export const spinner: StoryObj<SpinnerArgs> = {};
