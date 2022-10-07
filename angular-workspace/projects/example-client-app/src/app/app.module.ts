import { NgModule } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NimbleTextAreaModule, NimbleTextFieldModule, NimbleNumberFieldModule, NimbleSelectModule, NimbleListOptionModule,
    NimbleButtonModule, NimbleTreeViewModule, NimbleTreeItemModule, NimbleDrawerModule, NimbleThemeProviderModule,
    NimbleTabModule, NimbleTabPanelModule, NimbleTabsModule, NimbleTabsToolbarModule, NimbleMenuModule,
    NimbleMenuItemModule, NimbleCheckboxModule, NimbleToggleButtonModule, NimbleBreadcrumbModule, NimbleBreadcrumbItemModule,
    NimbleIconAddModule, NimbleSwitchModule, NimbleToolbarModule, NimbleMenuButtonModule, NimbleComboboxModule, NimbleTooltipModule,
    NimbleCardButtonModule, NimbleDialogModule, NimbleRadioGroupModule, NimbleRadioModule } from '@ni/nimble-angular';
import { AppComponent } from './app.component';
import { CustomAppComponent } from './customapp/customapp.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        CustomAppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
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
        NimbleRadioModule,
        RouterModule.forRoot([
            { path: '', redirectTo: '/customapp', pathMatch: 'full' },
            { path: 'customapp', component: CustomAppComponent }
        ],
        { useHash: true })
    ],
    providers: [FormBuilder],
    bootstrap: [AppComponent]
})
export class AppModule { }
