import { css } from '@ni/fast-element';
import { styles as iconSvgStyles } from '@ni/nimble-components/dist/esm/icon-svg/styles';
import { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';
import { themeBehavior } from '@ni/nimble-components/dist/esm/utilities/style/theme';

export const styles = css`
    ${iconSvgStyles}

    .dark-icon {
        display: none;
    }
`.withBehaviors(
    themeBehavior(Theme.dark, css`
        .light-icon {
            display: none;
        }

        .dark-icon {
            display: contents;
        }
    `)
);
