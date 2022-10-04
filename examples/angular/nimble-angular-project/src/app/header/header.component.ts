import { Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerLocation, NimbleDrawerDirective, Theme } from '@ni/nimble-angular';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  @Input() public location: DrawerLocation = DrawerLocation.left;
  @ViewChild('drawerReference', { read: NimbleDrawerDirective }) public drawer: NimbleDrawerDirective;

  @Input() public theme: Theme;
  @Output() public themeChange = new EventEmitter();

  public themes = Theme;

  public constructor(@Inject(Router) private readonly router: Router) { }

  public openDrawer(): void {
    this.drawer.show();
  }

  public themeSelectionChange(value: Theme): void {
    this.themeChange.emit(value);
  }

  public closeDrawer(): void {
    this.drawer.hide();
  }
}
