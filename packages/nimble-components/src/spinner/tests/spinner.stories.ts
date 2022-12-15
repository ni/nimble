import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { SpinnerSize } from '../types';
import '../../all-components';

interface SpinnerArgs {
    size: SpinnerSize;
}

const overviewText = 'The `nimble-spinner` is an animating indicator that can be placed in a particular region of a page to represent loading progress, or an ongoing operation, of an indeterminate / unknown duration.';

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
            options: Object.values(SpinnerSize),
            control: {
                type: 'radio',
                labels: {
                    [SpinnerSize.xSmall]: '"x-small" (16x16)',
                    undefined: 'small (default) (32x32)',
                    [SpinnerSize.medium]: '"medium" (48x48)',
                    [SpinnerSize.large]: '"large" (64x64)',
                    [SpinnerSize.xLarge]: '"x-large" (96x96)',
                    [SpinnerSize.xxLarge]: '"xx-large" (128x128)'
                }
            },
            table: { defaultValue: { summary: 'small (32x32)' } },
            description:
                'If omitted, `width` and `height` can be set on the `nimble-spinner` and the animating indicator will scale based on that size.'
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-spinner
            size="${x => x.size}"
        >
        </nimble-spinner>
    `),
    args: {
        size: SpinnerSize.small
    }
};

export default metadata;

export const spinner: StoryObj<SpinnerArgs> = {};
