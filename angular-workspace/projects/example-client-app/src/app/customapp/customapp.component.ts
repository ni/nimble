import { Component } from '@angular/core';
import { NimbleTheme } from '@ni/nimble-components/dist/esm/theme-provider/themes';
import { SelectionMode } from '@ni/nimble-components/dist/esm/tree-view/types';

@Component({
    selector: 'nimble-example-customapp',
    templateUrl: './customapp.component.html',
    styleUrls: ['./customapp.component.scss']
})
export class CustomAppComponent {
    public theme: NimbleTheme = NimbleTheme.Light;
    public themes = NimbleTheme;
    public selectionMode: SelectionMode = SelectionMode.LeavesOnly;
}
