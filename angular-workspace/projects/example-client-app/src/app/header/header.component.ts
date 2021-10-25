import { Component, Input } from '@angular/core';
import { NimbleTheme } from '@ni/nimble-components/dist/esm/theme-provider/themes';

@Component({
    selector: 'nimble-example-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    @Input() public theme: NimbleTheme = NimbleTheme.Light;
    public hideMenu = true;
    public disableUserSettings = true;

    public onMenuButtonClick(): void {
        this.toggleMenuHidden();
    }

    public onUserSettingsSelected(): void {
        // do some navigation here
        this.toggleMenuHidden();
    }

    public onLogoutSelected(): void {
        // do some navigation here
        this.toggleMenuHidden();
    }

    private toggleMenuHidden(): void {
        this.hideMenu = !this.hideMenu;
    }
}