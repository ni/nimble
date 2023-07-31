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
    NimbleAnchorModule, NimbleAnchorButtonModule, NimbleAnchorTabModule, NimbleAnchorTabsModule,
    NimbleIconCheckModule, NimbleBannerModule, NimbleAnchorMenuItemModule, NimbleAnchorTreeItemModule } from '@ni/nimble-angular';
import { NimbleLabelProviderCoreModule } from '@ni/nimble-angular/label-provider/core';
import { NimbleLabelProviderTableModule } from '@ni/nimble-angular/label-provider/table';
import { NimbleTableModule } from '@ni/nimble-angular/table';
import { NimbleTableColumnTextModule } from '@ni/nimble-angular/table-column/text';
import { NimbleTableColumnAnchorModule } from '@ni/nimble-angular/table-column/anchor';
import { NimbleRichTextViewerModule } from '@ni/nimble-angular/rich-text-viewer';
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
        NimbleLabelProviderCoreModule,
        NimbleLabelProviderTableModule,
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
        NimbleTableColumnAnchorModule,
        NimbleBannerModule,
        NimbleRichTextViewerModule,
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
