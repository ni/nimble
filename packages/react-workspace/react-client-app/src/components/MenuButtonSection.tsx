import { NimbleMenu } from '@ni/nimble-react/menu';
import { NimbleMenuItem, type MenuItemChangeEvent } from '@ni/nimble-react/menu-item';
import { NimbleMenuButton } from '@ni/nimble-react/menu-button';
import { NimbleIconAdd } from '@ni/nimble-react/icons/add';
import { SubContainer } from './SubContainer';

export function MenuButtonSection(): React.JSX.Element {
    function onMenuButtonMenuChange(event: MenuItemChangeEvent): void {
        const menuItemText = event.target.innerText;
        alert(`${menuItemText} selected`);
    }

    return (
        <SubContainer label="Menu Button">
            <NimbleMenuButton>
                Menu Button
                <NimbleMenu slot="menu"
                    onChange={onMenuButtonMenuChange}
                >
                    <header>Header 1</header>
                    <NimbleMenuItem>
                        Item 1
                        <NimbleIconAdd slot="start"></NimbleIconAdd>
                    </NimbleMenuItem>
                    <NimbleMenuItem>Item 2</NimbleMenuItem>
                    <hr/>
                    <header>Header 2</header>
                    <NimbleMenuItem>Item 4</NimbleMenuItem>
                </NimbleMenu>
            </NimbleMenuButton>
        </SubContainer>
    );
}
