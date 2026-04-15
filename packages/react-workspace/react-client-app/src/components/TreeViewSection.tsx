import { NimbleTreeView } from '@ni/nimble-react/tree-view';
import { NimbleTreeItem } from '@ni/nimble-react/tree-item';
import { NimbleAnchorTreeItem } from '@ni/nimble-react/anchor-tree-item';
import { SubContainer } from './SubContainer';

export function TreeViewSection(): React.JSX.Element {
    return (
        <SubContainer label="Tree View">
            <NimbleTreeView>
                <NimbleTreeItem>
                    Parent 1
                    <NimbleTreeItem>Child 1</NimbleTreeItem>
                    <NimbleAnchorTreeItem
                        href="#"
                    >Child 2 (link)</NimbleAnchorTreeItem>
                    <NimbleTreeItem disabled>Child 3</NimbleTreeItem>
                </NimbleTreeItem>
                <NimbleTreeItem expanded>
                    Parent 2
                    <NimbleTreeItem>Child 2-1</NimbleTreeItem>
                    <NimbleTreeItem>Child 2-2</NimbleTreeItem>
                    <NimbleTreeItem>Child 2-3</NimbleTreeItem>
                </NimbleTreeItem>
            </NimbleTreeView>
        </SubContainer>
    );
}
