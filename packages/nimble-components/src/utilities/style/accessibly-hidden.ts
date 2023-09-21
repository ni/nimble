import { cssPartial } from '@microsoft/fast-element';

/**
 * Hide content visually while keeping it screen reader-accessible.
 * Source: https://webaim.org/techniques/css/invisiblecontent/#techniques
 * See discussion here: https://github.com/microsoft/fast/issues/5740#issuecomment-1068195035
 */
export const accessiblyHidden = cssPartial`
    display: inline-block;
    height: 1px;
    width: 1px;
    position: absolute;
    margin: -1px;
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    overflow: hidden;
    padding: 0;
`;