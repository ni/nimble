import { html, ref } from '@ni/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import { TextFieldAppearance } from '@ni/nimble-components/dist/esm/text-field/types';
import type { Rectangle } from '.';

export const template = html<Rectangle>`<slot></slot><${buttonTag}>sdfsf</${buttonTag}><${textFieldTag}
placeholder='How can I assist you today?'
appearance=${TextFieldAppearance.block}
${ref('textField')}
></${textFieldTag}>`;
