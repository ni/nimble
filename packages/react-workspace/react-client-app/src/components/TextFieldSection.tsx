import { NimbleTextField } from '@ni/nimble-react/text-field';
import { SubContainer } from './SubContainer';

export function TextFieldSection(): React.JSX.Element {
    return (
        <SubContainer label="Text Field">
            <NimbleTextField appearance="underline" placeholder="Text Field" value="Here is text!">Underline Text Field</NimbleTextField>
            <NimbleTextField appearance="outline" placeholder="Text Field" value="Here is text!">Outline Text Field</NimbleTextField>
            <NimbleTextField appearance="block" placeholder="Text Field" value="Here is text!">Block Text Field</NimbleTextField>
        </SubContainer>
    );
}
