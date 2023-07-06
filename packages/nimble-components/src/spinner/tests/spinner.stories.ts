import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { isChromatic } from '../../utilities/tests/isChromatic';

import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import {
    spinnerLargeHeight,
    spinnerMediumHeight
} from '../../theme-provider/design-tokens';
import {
    scssPropertyFromTokenName,
    scssPropertySetterMarkdown,
    tokenNames
} from '../../theme-provider/design-token-names';
import { spinnerTag } from '..';
import { SpinnerAppearance } from '../types';

const spinnerSize = {
    small: null,
    medium: `height: var(${spinnerMediumHeight.cssCustomProperty});`,
    large: `height: var(${spinnerLargeHeight.cssCustomProperty});`
} as const;

interface SpinnerArgs {
    size: keyof typeof spinnerSize;
    appearance: keyof typeof SpinnerAppearance;
}

const overviewText = '<p>The `nimble-spinner` is an animating indicator that can be placed in a particular region of a page to represent '
    + 'loading progress, or an ongoing operation, of an indeterminate / unknown duration.</p>'
    + '<p>It has 3 sizes (64px, 32px, and 16px) and 2 appearance types (default and accent).</p>'
    + '<h4>Sizing</h4>'
    + '<p>The 64px spinner is a less commonly used size reserved for large negative empty space. Only one 64px spinner should be used on a single screen at one time.</p>'
    + '<p>The 32px spinner is a more commonly used size for negative empty space. No more than three 32px spinners should be used on a single screen at one time.</p>'
    + '<p>The 16px spinner is the most compact option for tight spaces such as grid cells and dense UI interfaces without much negative empty space. '
    + 'Multiple 16px spinners can be used on a single screen at one time.</p>'
    + '<h4>Styling / Theme</h4>'
    + '<p>Light UI controls are made of  dark attributes and designed to work against bright, light backgrounds. </p>'
    + '<p>Dark UI controls are made of light attributes and designed to work against bold, dark backgrounds. </p>'
    + '<p>Color UI controls are made of monochromatic attributes and designed to work against bold, medium-dark and dark colored backgrounds.</p>'
    + '<h4>-</h4>'
    + '<p>Use the `default` appearance Color UI version for backgrounds with color (e.g. purple, blue). </p>'
    + '<p>Do not use the `accent` appearance on any colored backgrounds, instead use the `default` Color UI version.</p>'
    + '<p>See the `size` and `appearance` usage details for information on customizing the spinner size and guidance for which appearance to use.</p>'
    + '<h4>Accessibility</h4>'
    + '<p>A low-motion/low-frame rate version of the spinner is also available.</p>'
    + '<p>When using colored backgrounds, confirm with your designer that a 3:1 contrast ration is met.</p>';

const metadata: Meta<SpinnerArgs> = {
    title: 'Components/Spinner',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        }
    },
    argTypes: {
        size: {
            description:
                'Size of the spinner component.<details><summary>Usage details</summary>To customize its size, set its CSS '
                + '<span style="font-family: monospace;">height</span> to a design token, and its width will automatically match its height. Each size will also require minimum pixel margins.<br/><ul>'
                + `<li>For Small (16x16): ${scssPropertySetterMarkdown(
                    tokenNames.spinnerSmallHeight,
                    'height'
                )}
                Requires 4px minimum margins.
                </li>`
                + `<li>For Medium (32x32): ${scssPropertySetterMarkdown(
                    tokenNames.spinnerMediumHeight,
                    'height'
                )}
                Requires 32px minimum margins.
                </li>`
                + `<li>For Large (64x64): ${scssPropertySetterMarkdown(
                    tokenNames.spinnerLargeHeight,
                    'height'
                )}
                Requires 64px minimum margins.
                </li></ul></details>`,
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
        },
        appearance: {
            options: Object.keys(SpinnerAppearance),
            control: { type: 'radio' },
            description:
                'Appearance of the spinner component.<details><summary>Usage details</summary>'
                + '<ul>'
                + `<li>For appearance "default":<br/>
                        Use in product instances.  This version helps avoid any association to status and the idea that this indicator is representing any context outside of an indeterminate wait time.
                    </li>`
                + `<li>For appearance "accent":<br/>
                        Use for promoting NI branding and adding a splash of color in a monochromatic setting.  Common places to use is home screens, licensing, dialogs and any instances where there will not be a conflict with green representing status.<br/>
                        The green version is not intended to represent “Good” or “Success”.  
                    </li></ul></details>`
        }
    },
    // Disable animation in Chromatic because it intermittently causes shapshot differences
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${spinnerTag}
            style="${x => spinnerSize[x.size]}; ${isChromatic() ? '--ni-private-spinner-animation-play-state:paused' : ''}"
            appearance="${x => SpinnerAppearance[x.appearance]}"
        >
        </${spinnerTag}>
    `),
    args: {
        size: 'small',
        appearance: 'default'
    }
};

export default metadata;

export const spinner: StoryObj<SpinnerArgs> = {};
