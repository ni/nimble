import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { SpinnerThemeVariant, SpinnerSize } from '../types';
import '../../all-components';

interface SpinnerArgs {
    size: string;
    themeVariant: keyof typeof SpinnerThemeVariant;
    forceReducedMotion: boolean;
    reducedMotionVariant: string;
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
                    [SpinnerSize.small]: 'Small (16x16)',
                    [SpinnerSize.medium]: 'Medium (32x32)',
                    [SpinnerSize.large]: 'Large (64x64)'
                }
            },
            table: { defaultValue: { summary: '32x32' } },
            description:
                'If omitted, `width` and `height` can be set on the `nimble-spinner` and the animating indicator will scale based on that size.'
        },
        themeVariant: {
            name: 'theme-variant',
            options: Object.keys(SpinnerThemeVariant),
            control: { type: 'radio' },
            description:
                "The 'prominent' variant only has an effect in the color theme."
        },
        reducedMotionVariant: {
            name: 'reduced-motion-variant',
            options: [
                'fade',
                'middle-step',
                'fade-first',
                'fade-first',
                'fade-both'
            ],
            control: {
                type: 'radio',
                labels: {
                    fade: 'fade: Cross-fade between the 2 alternating bit positions',
                    'middle-step':
                        'middle-step: Add 1 intermediate step between each position (still progresses clockwise)',
                    'fade-first':
                        'fade-first: Fade in and out: 1st position only',
                    'fade-both':
                        'fade-both: Fade in and out: (1st position, 2nd, [repeat])'
                }
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-spinner
            size="${x => x.size}"
            theme-variant="${x => SpinnerThemeVariant[x.themeVariant]}"
            reduced-motion-variant="${x => x.reducedMotionVariant}"
            class="${x => (x.forceReducedMotion ? 'prefers-reduced-motion' : '')}"
        >
        </nimble-spinner>
    `),
    args: {
        size: SpinnerSize.medium,
        themeVariant: 'default',
        forceReducedMotion: false,
        reducedMotionVariant: 'fade'
    }
};

export default metadata;

export const spinner: StoryObj<SpinnerArgs> = {};
