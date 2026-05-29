import { NimbleToggleButton } from '@ni/nimble-react/toggle-button';
import { SubContainer } from './SubContainer';

export function ToggleButtonsSection(): React.JSX.Element {
    return (
        <SubContainer label="Buttons - Toggle">
            <NimbleToggleButton appearance="outline">Outline Toggle Button</NimbleToggleButton>
            <NimbleToggleButton appearance="block">Block Toggle Button</NimbleToggleButton>
            <NimbleToggleButton appearance="ghost">Ghost Toggle Button</NimbleToggleButton>
        </SubContainer>
    );
}
