import { Component } from '@angular/core';

@Component({
    selector: 'example-tree-view-section',
    template: `
        <example-sub-container label="Tree View">
            <nimble-tree-view>
                <nimble-tree-item>
                    Parent 1
                    <nimble-tree-item>Child 1</nimble-tree-item>
                    <nimble-anchor-tree-item nimbleRouterLink="/customapp">Child 2 (link)</nimble-anchor-tree-item>
                    <nimble-tree-item disabled>Child 3</nimble-tree-item>
                </nimble-tree-item>
                <nimble-tree-item expanded>
                    Parent 2
                    <nimble-tree-item selected>Child 2-1</nimble-tree-item>
                    <nimble-tree-item>Child 2-2</nimble-tree-item>
                    <nimble-tree-item>Child 2-3</nimble-tree-item>
                </nimble-tree-item>
            </nimble-tree-view>
        </example-sub-container>
    `,
    standalone: false
})
export class TreeViewSectionComponent {}
