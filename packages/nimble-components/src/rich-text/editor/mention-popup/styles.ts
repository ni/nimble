import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { styles as dropdownStyles } from '../../../patterns/dropdown/styles';

export const styles = css`
    ${display('inline-flex')}
    ${dropdownStyles}
  
    .listbox {
        height: 160px;
        min-width: 100px;
    }
`;
