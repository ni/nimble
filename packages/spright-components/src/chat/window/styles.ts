import { css } from '@microsoft/fast-element';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    :host {
        flex-direction: column;
    }

    ${textFieldTag} {
        flex-grow: 1;
    }
`;
