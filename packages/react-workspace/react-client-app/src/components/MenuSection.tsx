import { NimbleMenu } from '@ni/nimble-react/menu';
import { NimbleMenuItem } from '@ni/nimble-react/menu-item';
import { NimbleAnchorMenuItem } from '@ni/nimble-react/anchor-menu-item';
import { NimbleIconAdd } from '@ni/nimble-react/icons/add';
import { SubContainer } from './SubContainer';

export function MenuSection(): React.JSX.Element {
    return (
        <SubContainer label="Menu">
            <NimbleMenu>
                <header>Header 1</header>
                <NimbleMenuItem>
                    Item 1
                    <NimbleIconAdd slot="start"></NimbleIconAdd>
                </NimbleMenuItem>
                <NimbleMenuItem>Item 2</NimbleMenuItem>
                <hr />
                <header>Header 2</header>
                <NimbleMenuItem>Item 4</NimbleMenuItem>
                <NimbleAnchorMenuItem
                    href="#"
                >Item 5 (link)</NimbleAnchorMenuItem>
            </NimbleMenu>
        </SubContainer>
    );
}
