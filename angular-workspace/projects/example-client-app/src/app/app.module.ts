import { NgModule } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NimbleTextAreaModule, NimbleTextFieldModule, NimbleNumberFieldModule, NimbleSelectModule, NimbleListOptionModule,
    NimbleButtonModule, NimbleTreeViewModule, NimbleTreeItemModule, NimbleDrawerModule, NimbleThemeProviderModule,
    NimbleTabModule, NimbleTabPanelModule, NimbleTabsModule, NimbleTabsToolbarModule, NimbleMenuModule,
    NimbleMenuItemModule, NimbleCheckboxModule, NimbleToggleButtonModule, NimbleBreadcrumbModule, NimbleBreadcrumbItemModule,
    NimbleIconAddModule, NimbleSwitchModule, NimbleToolbarModule, NimbleMenuButtonModule, NimbleComboboxModule, NimbleTooltipModule,
    NimbleCardButtonModule, NimbleDialogModule, NimbleRadioGroupModule, NimbleRadioModule, NimbleSpinnerModule,
    NimbleAnchorModule, NimbleAnchorButtonModule, NimbleAnchorTabModule, NimbleAnchorTabsModule, NimbleTableColumnTextModule, NimbleIconCheckModule, NimbleBannerModule, NimbleAnchorMenuItemModule, NimbleAnchorTreeItemModule } from '@ni/nimble-angular';
import { NimbleTableModule } from 'projects/ni/nimble-angular/src/public-api';
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
        NimbleAnchorMenuItemModule,
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
        NimbleIconCheckModule,
        NimbleSpinnerModule,
        NimbleSwitchModule,
        NimbleToolbarModule,
        NimbleComboboxModule,
        NimbleMenuButtonModule,
        NimbleTooltipModule,
        NimbleCardButtonModule,
        NimbleDialogModule,
        NimbleRadioGroupModule,
        NimbleRadioModule,
        NimbleAnchorModule,
        NimbleAnchorButtonModule,
        NimbleAnchorTabModule,
        NimbleAnchorTabsModule,
        NimbleAnchorTreeItemModule,
        NimbleTableModule,
        NimbleTableColumnTextModule,
        NimbleBannerModule,
        RouterModule.forRoot(
            [
                { path: '', redirectTo: '/customapp', pathMatch: 'full' },
                { path: 'customapp', component: CustomAppComponent, title: 'Angular All Components Demo - Nimble Design System - NI' }
            ],
            { useHash: true }
        )
    ],
    providers: [FormBuilder],
    bootstrap: [AppComponent]
})
export class AppModule { }
