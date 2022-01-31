import { Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NimbleDrawerDirective, NimbleTheme } from '@ni/nimble-angular';

@Component({
    selector: 'example-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    @ViewChild('drawerReference', { read: NimbleDrawerDirective }) public userSettingsDrawer: NimbleDrawerDirective;

    @Input() public theme: NimbleTheme;
    @Output() public themeChange = new EventEmitter();

    public themes = NimbleTheme;
    public hideMenu = true;
    public disableUserSettings = true;

    public constructor(@Inject(Router) private readonly router: Router) { }

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
