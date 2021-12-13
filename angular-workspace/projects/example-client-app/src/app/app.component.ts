import { Component } from '@angular/core';
import { NimbleTheme } from '@ni/nimble-angular';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public theme: NimbleTheme = NimbleTheme.Light;
}
