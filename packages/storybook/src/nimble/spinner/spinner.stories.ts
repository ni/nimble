import { html } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import {
    spinnerLargeHeight,
    spinnerMediumHeight
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    scssPropertyFromTokenName,
    scssPropertySetterMarkdown,
    tokenNames
} from '@ni/nimble-components/dist/esm/theme-provider/design-token-names';
import { spinnerTag } from '@ni/nimble-components/dist/esm/spinner';
import { SpinnerAppearance } from '@ni/nimble-components/dist/esm/spinner/types';
import { isChromatic } from '../../utilities/isChromatic';

import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../utilities/storybook';

const spinnerSize = {
    small: null,
    medium: `height: var(${spinnerMediumHeight.cssCustomProperty});`,
    large: `height: var(${spinnerLargeHeight.cssCustomProperty});`
} as const;

interface SpinnerArgs {
    size: keyof typeof spinnerSize;
    appearance: keyof typeof SpinnerAppearance;
}

const metadata: Meta<SpinnerArgs> = {
    title: 'Components/Spinner',
    parameters: {},
    argTypes: {
        size: {
            name: 'Spinner sizing',
            description:
                '<p>Size of the spinner component.</p><details><summary>Usage details</summary>To customize its size, set its CSS '
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
            table: { category: apiCategory.styles },
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
                '<p>Appearance of the spinner component.</p><details><summary>Usage details</summary>'
                + '<ul>'
                + `<li>For appearance \`default\`:<br/>
                        Use in product instances.  This version helps avoid any association to status and the idea that this indicator is representing any context outside of an indeterminate wait time.
                    </li>`
                + `<li>For appearance \`accent\`:<br/>
                        Use for promoting NI branding and adding a splash of color in a monochromatic setting.  Common places to use is home screens, licensing, dialogs and any instances where there will not be a conflict with green representing status.<br/>
                        The green version is not intended to represent “Good” or “Success”.  
                    </li></ul></details>`,
            table: { category: apiCategory.attributes }
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
