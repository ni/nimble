import { NgModule } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NimbleTextAreaModule, NimbleTextFieldModule, NimbleNumberFieldModule, NimbleSelectModule, NimbleListOptionModule,
    NimbleButtonModule, NimbleTreeViewModule, NimbleTreeItemModule, NimbleDrawerModule, NimbleThemeProviderModule,
    NimbleTabModule, NimbleTabPanelModule, NimbleTabsModule, NimbleTabsToolbarModule, NimbleMenuModule,
    NimbleMenuItemModule, NimbleCheckboxModule, NimbleToggleButtonModule, NimbleBreadcrumbModule, NimbleBreadcrumbItemModule,
    NimbleIconAddModule, NimbleIconCopyTextModule, NimbleIconWebviCustomModule, NimbleSwitchModule, NimbleToolbarModule, NimbleMenuButtonModule, NimbleComboboxModule, NimbleTooltipModule,
    NimbleCardButtonModule, NimbleDialogModule, NimbleRadioGroupModule, NimbleRadioModule, NimbleSpinnerModule,
    NimbleAnchorModule, NimbleAnchorButtonModule, NimbleAnchorTabModule, NimbleAnchorTabsModule,
    NimbleIconCheckModule, NimbleBannerModule, NimbleAnchorMenuItemModule, NimbleAnchorTreeItemModule, NimbleIconXmarkCheckModule,
    NimbleListOptionGroupModule } from '@ni/nimble-angular';
import { NimbleCardModule } from '@ni/nimble-angular/card';
import { NimbleLabelProviderCoreModule } from '@ni/nimble-angular/label-provider/core';
import { NimbleLabelProviderRichTextModule } from '@ni/nimble-angular/label-provider/rich-text';
import { NimbleLabelProviderTableModule } from '@ni/nimble-angular/label-provider/table';
import { NimbleMappingTextModule } from '@ni/nimble-angular/mapping/text';
import { NimbleMappingIconModule } from '@ni/nimble-angular/mapping/icon';
import { NimbleMappingUserModule } from '@ni/nimble-angular/mapping/user';
import { NimbleMappingSpinnerModule } from '@ni/nimble-angular/mapping/spinner';
import { NimbleMappingEmptyModule } from '@ni/nimble-angular/mapping/empty';
import { NimbleTableModule } from '@ni/nimble-angular/table';
import { NimbleTableColumnTextModule } from '@ni/nimble-angular/table-column/text';
import { NimbleTableColumnAnchorModule } from '@ni/nimble-angular/table-column/anchor';
import { NimbleTableColumnDateTextModule } from '@ni/nimble-angular/table-column/date-text';
import { NimbleTableColumnMappingModule } from '@ni/nimble-angular/table-column/mapping';
import { NimbleTableColumnNumberTextModule } from '@ni/nimble-angular/table-column/number-text';
import { NimbleTableColumnDurationTextModule } from '@ni/nimble-angular/table-column/duration-text';
import { NimbleTableColumnMenuButtonModule } from '@ni/nimble-angular/table-column/menu-button';
import { NimbleRichTextViewerModule } from '@ni/nimble-angular/rich-text/viewer';
import { NimbleRichTextEditorModule } from '@ni/nimble-angular/rich-text/editor';
import { NimbleRichTextMentionUsersModule } from '@ni/nimble-angular/rich-text-mention/users';
import { SprightChatConversationModule } from '@ni/spright-angular/chat/conversation';
import { SprightChatInputModule } from '@ni/spright-angular/chat/input';
import { SprightChatMessageModule } from '@ni/spright-angular/chat/message';
import { SprightRectangleModule } from '@ni/spright-angular/rectangle';
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
        NimbleListOptionGroupModule,
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
        NimbleIconCopyTextModule,
        NimbleIconWebviCustomModule,
        NimbleIconXmarkCheckModule,
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
        NimbleTableColumnNumberTextModule,
        NimbleTableColumnDurationTextModule,
        NimbleTableColumnMenuButtonModule,
        NimbleMappingTextModule,
        NimbleBannerModule,
        NimbleRichTextViewerModule,
        NimbleRichTextEditorModule,
        NimbleTableColumnMappingModule,
        NimbleMappingIconModule,
        NimbleMappingUserModule,
        NimbleRichTextMentionUsersModule,
        NimbleMappingSpinnerModule,
        NimbleMappingEmptyModule,
        SprightChatConversationModule,
        SprightChatInputModule,
        SprightChatMessageModule,
        SprightRectangleModule,
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
