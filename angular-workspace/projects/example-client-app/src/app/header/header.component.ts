import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerLocation, NimbleDrawerDirective, NimbleTheme } from '@ni/nimble-angular';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/button/types';

@Component({
    selector: 'nimble-example-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    @ViewChild('drawerReference', { read: NimbleDrawerDirective }) public userSettingsDrawer: NimbleDrawerDirective;

    @Input() public theme: NimbleTheme;
    @Output() public themeChange = new EventEmitter();

    public themes = NimbleTheme;
    public buttonAppearances = ButtonAppearance;
    public location: DrawerLocation = DrawerLocation.Right;
    public hideMenu = true;
    public disableUserSettings = true;

    public constructor(private readonly router: Router) { }

    public onMenuButtonClick(): void {
        this.toggleMenuHidden();
    }

    public onUserSettingsSelected(): void {
        this.userSettingsDrawer.show();
        this.toggleMenuHidden();
    }

    public themeSelectionChange(value: NimbleTheme): void {
        this.themeChange.emit(value);
    }

    public closeButtonClicked(): void {
        this.userSettingsDrawer.hide();
    }

    public onLogoutSelected(): void {
        this.toggleMenuHidden();
        void this.router.navigate(['/login']);
    }

    private toggleMenuHidden(): void {
        this.hideMenu = !this.hideMenu;
    }
}
