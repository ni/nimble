import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  NimbleBreadcrumbItemModule,
  NimbleBreadcrumbModule,
  NimbleButtonModule,
  NimbleCardButtonModule,
  NimbleCheckboxModule,
  NimbleComboboxModule,
  NimbleDialogModule,
  NimbleDrawerModule,
  NimbleIconAddModule,
  NimbleListOptionModule,
  NimbleMenuButtonModule,
  NimbleMenuItemModule,
  NimbleMenuModule,
  NimbleNumberFieldModule,
  NimbleRadioButtonModule,
  NimbleRadioGroupModule,
  NimbleSelectModule,
  NimbleSwitchModule,
  NimbleTabModule,
  NimbleTabPanelModule,
  NimbleTabsModule,
  NimbleTabsToolbarModule,
  NimbleTextAreaModule,
  NimbleTextFieldModule,
  NimbleThemeProviderModule,
  NimbleToggleButtonModule,
  NimbleToolbarModule,
  NimbleTooltipModule,
  NimbleTreeItemModule,
  NimbleTreeViewModule
} from '@ni/nimble-angular';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NimbleThemeProviderModule,
    NimbleTextAreaModule,
    NimbleTextFieldModule,
    NimbleNumberFieldModule,
    NimbleSelectModule,
    NimbleListOptionModule,
    NimbleButtonModule,
    NimbleTreeViewModule,
    NimbleTreeItemModule,
    NimbleMenuModule,
    NimbleMenuItemModule,
    NimbleTabsModule,
    NimbleTabModule,
    NimbleTabPanelModule,
    NimbleTabsToolbarModule,
    NimbleDrawerModule,
    NimbleCheckboxModule,
    NimbleToggleButtonModule,
    NimbleBreadcrumbModule,
    NimbleBreadcrumbItemModule,
    NimbleIconAddModule,
    NimbleSwitchModule,
    NimbleToolbarModule,
    NimbleComboboxModule,
    NimbleMenuButtonModule,
    NimbleTooltipModule,
    NimbleCardButtonModule,
    NimbleDialogModule,
    NimbleRadioGroupModule,
    NimbleRadioButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
