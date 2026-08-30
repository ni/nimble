import { NimbleButton } from '@ni/nimble-react/button';
import { NimbleTabs } from '@ni/nimble-react/tabs';
import { NimbleTab } from '@ni/nimble-react/tab';
import { NimbleTabsToolbar } from '@ni/nimble-react/tabs-toolbar';
import { NimbleTabPanel } from '@ni/nimble-react/tab-panel';
import { SubContainer } from './SubContainer';

export function TabsSection(): React.JSX.Element {
    function onTabToolbarButtonClick(): void {
        alert('Tab toolbar button clicked');
    }

    return (
        <SubContainer label="Tabs">
            <NimbleTabs activeid="tab-1">
                <NimbleTab id="tab-1">Tab 1</NimbleTab>
                <NimbleTab id="tab-2">Tab 2</NimbleTab>
                <NimbleTab id="tab-3" disabled>Tab 3 (Disabled)</NimbleTab>
                <NimbleTabsToolbar>
                    <NimbleButton
                        onClick={onTabToolbarButtonClick}
                    >Toolbar button</NimbleButton>
                </NimbleTabsToolbar>
                <NimbleTabPanel>
                    <div className="container-label">Tab 1 content</div>
                </NimbleTabPanel>
                <NimbleTabPanel>
                    <div className="container-label">Tab 2 content</div>
                </NimbleTabPanel>
                <NimbleTabPanel>
                    <div className="container-label">Tab 3 content</div>
                </NimbleTabPanel>
            </NimbleTabs>
        </SubContainer>
    );
}
