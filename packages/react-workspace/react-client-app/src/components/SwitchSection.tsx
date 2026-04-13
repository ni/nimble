import { NimbleSwitch } from '@ni/nimble-react/switch';
import { SubContainer } from './SubContainer';

export function SwitchSection(): React.JSX.Element {
    return (
        <SubContainer label="Switch">
            <NimbleSwitch>Switch</NimbleSwitch>
            <NimbleSwitch checked>
                Switch with checked/unchecked messages
                <span slot="unchecked-message">Off</span>
                <span slot="checked-message">On</span>
            </NimbleSwitch>
        </SubContainer>
    );
}
