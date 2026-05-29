import { NimbleButton } from '@ni/nimble-react/button';
import { NimbleToolbar } from '@ni/nimble-react/toolbar';
import { SubContainer } from './SubContainer';

export function ToolbarSection(): React.JSX.Element {
    return (
        <SubContainer label="Toolbar">
            <NimbleToolbar>
                <NimbleButton slot="start" appearance="outline">First button</NimbleButton>
                <NimbleButton slot="start" appearance="outline">Second button</NimbleButton>
                <NimbleButton>Middle button</NimbleButton>
                <NimbleButton slot="end" appearance="outline">Last button</NimbleButton>
            </NimbleToolbar>
        </SubContainer>
    );
}
