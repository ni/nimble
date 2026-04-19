import { NimbleTextArea } from '@ni/nimble-react/text-area';
import { SubContainer } from './SubContainer';

export function TextAreaSection(): React.JSX.Element {
    return (
        <SubContainer label="Text Area">
            <NimbleTextArea placeholder="Text Area" cols={50} rows={5} resize="horizontal" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.">Text Area Label</NimbleTextArea>
        </SubContainer>
    );
}
