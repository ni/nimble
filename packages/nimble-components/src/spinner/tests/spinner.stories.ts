import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import {
    spinnerLargeHeight,
    spinnerMediumHeight
} from '../../theme-provider/design-tokens';

const spinnerSize = {
    small: null,
    medium: `height: var(${spinnerMediumHeight.cssCustomProperty});`,
    large: `height: var(${spinnerLargeHeight.cssCustomProperty});`
} as const;

interface SpinnerArgs {
    size: keyof typeof spinnerSize;
}

const overviewText = '<p>The `nimble-spinner` is an animating indicator that can be placed in a particular region of a page to represent '
    + 'loading progress, or an ongoing operation, of an indeterminate / unknown duration.</p>'
    + '<p>To customize its size, set its CSS `height` to a design token, and its width will automatically match its height.</p>'
    + '<ul>'
    + '<li>16x16 (small, default)'
    + '<ul><li>Example usages: Alongside inline text, or small controls like checkboxes; in a table control row/cell</li></ul>'
    + '</li>'
    + '<li>32x32 (medium)'
    + `<ul><li>\`height: var(${spinnerMediumHeight.cssCustomProperty});\`</li></ul>`
    + '</li>'
    + '<li>64x64 (large)'
    + `<ul><li>\`height: var(${spinnerLargeHeight.cssCustomProperty});\`</li>`
    + '<li>Example usage: For the  loading progress of components that take up the majority of a page</li></ul>'
    + '</li>'
    + '</ul>'
    + '<p>The spinner will also scale appropriately if its width/ height are overriden via CSS styles, for advanced use cases.</p>';

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
            description:
                'Size of the spinner. To customize its size, set its CSS `height` to a design token, and its width will automatically match its height:<br/><ul>'
                + `<li>For 32x32: \`height: var(${spinnerMediumHeight.cssCustomProperty});\`</li>`
                + `<li>For 64x64: \`height: var(${spinnerLargeHeight.cssCustomProperty});\`</li></ul>`,
            options: Object.keys(spinnerSize),
            table: { defaultValue: { summary: '16x16 (small)' } },
            control: {
                type: 'radio',
                labels: {
                    small: '16x16 (small, default)',
                    medium: `32x32 (${spinnerMediumHeight.cssCustomProperty})`,
                    large: `64x64 (${spinnerLargeHeight.cssCustomProperty})`
                }
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-spinner
            style="${x => spinnerSize[x.size]}"
        >
        </nimble-spinner>
    `),
    args: {
        size: 'small'
    }
};

export default metadata;

export const spinner: StoryObj<SpinnerArgs> = {};
