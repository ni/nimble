import { Component } from '@angular/core';
import { Theme } from '@ni/nimble-angular';

@Component({
    selector: 'example-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
    public readonly prefersColorSchemeDarkMediaQuery: MediaQueryList = window.matchMedia(
        '(prefers-color-scheme: dark)'
    );

    public readonly themes = Object.values(Theme);
    public theme: Theme = this.prefersColorSchemeDarkMediaQuery.matches ? 'dark' : 'light';
}
