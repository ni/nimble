import { Component } from '@angular/core';
import { NimbleTheme } from '@ni/nimble-components/dist/esm/theme-provider/themes';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public title = 'example-client-app';

    public theme: NimbleTheme = NimbleTheme.Light;
    public onoff: string = "off";
    public themes = NimbleTheme;
    private toggle = true;

    ngOnInit(){
        
    }

    onClick() {
        this.toggle = !this.toggle;
        this.theme = this.toggle ? NimbleTheme.Light : NimbleTheme.Dark;
        this.onoff = this.toggle ? "off" : "on";
    }
}
