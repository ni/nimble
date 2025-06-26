import { Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NimbleDrawerDirective, Theme } from '@ni/nimble-angular';

@Component({
    selector: 'example-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    @Input() public theme: Theme;
    @Output() public themeChange = new EventEmitter();

    public themes = Theme;

    @ViewChild('drawerReference', { read: NimbleDrawerDirective }) private readonly userSettingsDrawer: NimbleDrawerDirective;

    public constructor(@Inject(Router) private readonly router: Router) { }

    public onUserSettingsSelected(): void {
        void this.userSettingsDrawer.show();
    }

    public themeSelectionChange(value: Theme): void {
        this.themeChange.emit(value);
    }

    public closeButtonClicked(): void {
        this.userSettingsDrawer.close();
    }
}
