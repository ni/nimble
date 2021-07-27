import { Component } from '@angular/core';
import { NimbleTheme } from '@ni/nimble-components/dist/esm/theme-provider/themes';

@Component({
    selector: 'nimble-example-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    public theme: NimbleTheme = NimbleTheme.Light;
    public themes = NimbleTheme;
    private toggle = true;

    public switchThemes(): void {
        this.toggle = !this.toggle;
        this.theme = this.toggle ? NimbleTheme.Light : NimbleTheme.Dark;
    }
}
