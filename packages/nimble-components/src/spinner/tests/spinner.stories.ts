import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import {
    spinnerLargeHeight,
    spinnerMediumHeight
} from '../../theme-provider/design-tokens';
import {
    scssPropertyFromTokenName,
    scssPropertySetterMarkdown,
    tokenNames
} from '../../theme-provider/design-token-names';

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
    + '<p>See the `size` argument details for information on customizing the spinner size.</p>';

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
        },
        // Spinner animation causes snapshot changes in chromatic
        // See https://github.com/ni/nimble/issues/983
        chromatic: {
            disableSnapshot: true
        }
    },
    argTypes: {
        size: {
            description:
                'Size of the spinner component.<details><summary>Usage details</summary>To customize its size, set its CSS '
                + '<span style="font-family: monospace;">height</span> to a design token, and its width will automatically match its height:<br/><ul>'
                + `<li>For Small (16x16): ${scssPropertySetterMarkdown(
                    tokenNames.spinnerSmallHeight,
                    'height'
                )}</li>`
                + `<li>For Medium (32x32): ${scssPropertySetterMarkdown(
                    tokenNames.spinnerMediumHeight,
                    'height'
                )}</li>`
                + `<li>For Large (64x64): ${scssPropertySetterMarkdown(
                    tokenNames.spinnerLargeHeight,
                    'height'
                )}</li></ul></details>`,
            options: Object.keys(spinnerSize),
            table: { defaultValue: { summary: 'Small (16x16)' } },
            control: {
                type: 'radio',
                labels: {
                    small: `Small - 16x16 (default) - ${scssPropertyFromTokenName(
                        tokenNames.spinnerSmallHeight
                    )}`,
                    medium: `Medium - 32x32 - ${scssPropertyFromTokenName(
                        tokenNames.spinnerMediumHeight
                    )}`,
                    large: `Large - 64x64 - ${scssPropertyFromTokenName(
                        tokenNames.spinnerLargeHeight
                    )}`
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
