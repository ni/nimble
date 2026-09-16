import { NimbleButton } from '@ni/nimble-react/button';
import { NimbleAnchorTabs } from '@ni/nimble-react/anchor-tabs';
import { NimbleAnchorTab } from '@ni/nimble-react/anchor-tab';
import { NimbleTabsToolbar } from '@ni/nimble-react/tabs-toolbar';
import { SubContainer } from './SubContainer';

export function AnchorTabsSection(): React.JSX.Element {
    function onTabToolbarButtonClick(): void {
        alert('Tab toolbar button clicked');
    }

    return (
        <SubContainer label="Tabs - Anchor">
            <NimbleAnchorTabs activeid="a-tab-1">
                <NimbleAnchorTab id="a-tab-1" href="https://nimble.ni.dev">Tab 1</NimbleAnchorTab>
                <NimbleAnchorTab id="a-tab-2" href="https://ni.com">Tab 2</NimbleAnchorTab>
                <NimbleAnchorTab disabled id="a-tab-3" href="https://google.com">Tab 3 (Disabled)</NimbleAnchorTab>
                <NimbleTabsToolbar>
                    <NimbleButton
                        onClick={onTabToolbarButtonClick}
                    >Toolbar button</NimbleButton>
                </NimbleTabsToolbar>
            </NimbleAnchorTabs>
        </SubContainer>
    );
}
