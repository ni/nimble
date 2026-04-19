/* eslint-disable no-alert */
import { Component } from '@angular/core';
import type { MenuItem } from '@ni/nimble-angular';

@Component({
    selector: 'example-menu-button-section',
    template: `
        <example-sub-container label="Menu Button">
            <nimble-menu-button>
                Menu Button
                <nimble-menu slot="menu" (change)="onMenuButtonMenuChange($event)">
                    <header>Header 1</header>
                    <nimble-menu-item>
                        Item 1
                        <nimble-icon-add slot="start"></nimble-icon-add>
                    </nimble-menu-item>
                    <nimble-menu-item>Item 2</nimble-menu-item>
                    <hr>
                    <header>Header 2</header>
                    <nimble-menu-item>Item 4</nimble-menu-item>
                </nimble-menu>
            </nimble-menu-button>
        </example-sub-container>
    `,
    standalone: false
})
export class MenuButtonSectionComponent {
    public onMenuButtonMenuChange(event: Event): void {
        const menuItemText = (event.target as MenuItem).innerText;
        alert(`${menuItemText} selected`);
    }
}
