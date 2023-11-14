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
import { NimbleCardModule } from '@ni/nimble-angular/card';
import { NimbleLabelProviderCoreModule } from '@ni/nimble-angular/label-provider/core';
import { NimbleLabelProviderRichTextModule } from '@ni/nimble-angular/label-provider/rich-text';
import { NimbleLabelProviderTableModule } from '@ni/nimble-angular/label-provider/table';
import { NimbleMappingTextModule } from '@ni/nimble-angular/mapping/text';
import { NimbleMappingIconModule } from '@ni/nimble-angular/mapping/icon';
import { NimbleMappingSpinnerModule } from '@ni/nimble-angular/mapping/spinner';
import { NimbleTableModule } from '@ni/nimble-angular/table';
import { NimbleTableColumnTextModule } from '@ni/nimble-angular/table-column/text';
import { NimbleTableColumnAnchorModule } from '@ni/nimble-angular/table-column/anchor';
import { NimbleTableColumnDateTextModule } from '@ni/nimble-angular/table-column/date-text';
import { NimbleTableColumnEnumTextModule } from '@ni/nimble-angular/table-column/enum-text';
import { NimbleTableColumnIconModule } from '@ni/nimble-angular/table-column/icon';
import { NimbleTableColumnNumberTextModule } from '@ni/nimble-angular/table-column/number-text';
import { NimbleTableColumnDurationTextModule } from '@ni/nimble-angular/table-column/duration-text';
import { NimbleRichTextViewerModule } from '@ni/nimble-angular/rich-text/viewer';
import { NimbleRichTextEditorModule } from '@ni/nimble-angular/rich-text/editor';
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
        NimbleLabelProviderRichTextModule,
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
        NimbleCardModule,
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
        NimbleTableColumnDateTextModule,
        NimbleTableColumnEnumTextModule,
        NimbleTableColumnNumberTextModule,
        NimbleTableColumnDurationTextModule,
        NimbleMappingTextModule,
        NimbleBannerModule,
        NimbleRichTextViewerModule,
        NimbleRichTextEditorModule,
        NimbleTableColumnIconModule,
        NimbleMappingIconModule,
        NimbleMappingSpinnerModule,
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
