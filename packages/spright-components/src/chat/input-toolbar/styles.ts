import { css } from '@microsoft/fast-element';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import { toolbarTag } from '@ni/nimble-components/dist/esm/toolbar';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    /* TODO: Inline theme provider styles to work around build issue */
    ni-nimble-theme-provider {
        display: contents;
    }

    ${toolbarTag} {
        width: 100%;
    }

    ${textFieldTag} {
        flex-grow: 1;
    }
`;
