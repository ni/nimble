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
    NimbleListOptionGroupModule,
    NimbleIconPencilToRectangleModule,
    NimbleIconMessagesSparkleModule } from '@ni/nimble-angular';
import { NimbleCardModule } from '@ni/nimble-angular/card';
import { NimbleChipModule } from '@ni/nimble-angular/chip';
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
import { NimbleStepperModule } from '@ni/nimble-angular/stepper';
import { NimbleStepModule } from '@ni/nimble-angular/step';
import { NimbleAnchorStepModule } from '@ni/nimble-angular/anchor-step';
import { OkButtonModule } from 'ok-angular/button/ok-button.module';
import { SprightChatConversationModule } from '@ni/spright-angular/chat/conversation';
import { SprightChatInputModule } from '@ni/spright-angular/chat/input';
import { SprightIconWorkItemCalendarWeekDirective } from '@ni/spright-angular/icons/work-item-calendar-week';
import { SprightChatMessageInboundModule } from '@ni/spright-angular/chat/message/inbound';
import { SprightChatMessageOutboundModule } from '@ni/spright-angular/chat/message/outbound';
import { SprightChatMessageSystemModule } from '@ni/spright-angular/chat/message/system';
import { SprightRectangleModule } from '@ni/spright-angular/rectangle';
import { AppComponent } from './app.component';
import { CustomAppComponent } from './customapp/customapp.component';
import { SubContainerComponent } from './customapp/sub-container.component';
import { OverviewSectionComponent } from './customapp/overview-section.component';
import { AnchorSectionComponent } from './customapp/anchor-section.component';
import { BannerSectionComponent } from './customapp/banner-section.component';
import { BreadcrumbSectionComponent } from './customapp/breadcrumb-section.component';
import { ButtonsSectionComponent } from './customapp/buttons-section.component';
import { AnchorButtonsSectionComponent } from './customapp/anchor-buttons-section.component';
import { ToggleButtonsSectionComponent } from './customapp/toggle-buttons-section.component';
import { CardSectionComponent } from './customapp/card-section.component';
import { CardButtonSectionComponent } from './customapp/card-button-section.component';
import { CheckboxSectionComponent } from './customapp/checkbox-section.component';
import { ChipSectionComponent } from './customapp/chip-section.component';
import { RadioButtonsSectionComponent } from './customapp/radio-buttons-section.component';
import { DialogSectionComponent } from './customapp/dialog-section.component';
import { DrawerSectionComponent } from './customapp/drawer-section.component';
import { MenuSectionComponent } from './customapp/menu-section.component';
import { MenuButtonSectionComponent } from './customapp/menu-button-section.component';
import { NumberFieldSectionComponent } from './customapp/number-field-section.component';
import { SelectSectionComponent } from './customapp/select-section.component';
import { ComboboxSectionComponent } from './customapp/combobox-section.component';
import { RichTextEditorSectionComponent } from './customapp/rich-text-editor-section.component';
import { RichTextViewerSectionComponent } from './customapp/rich-text-viewer-section.component';
import { SpinnerSectionComponent } from './customapp/spinner-section.component';
import { SwitchSectionComponent } from './customapp/switch-section.component';
import { TableSectionComponent } from './customapp/table-section.component';
import { DelayedHierarchyTableSectionComponent } from './customapp/delayed-hierarchy-table-section.component';
import { TabsSectionComponent } from './customapp/tabs-section.component';
import { AnchorTabsSectionComponent } from './customapp/anchor-tabs-section.component';
import { TextAreaSectionComponent } from './customapp/text-area-section.component';
import { TextFieldSectionComponent } from './customapp/text-field-section.component';
import { ToolbarSectionComponent } from './customapp/toolbar-section.component';
import { TooltipSectionComponent } from './customapp/tooltip-section.component';
import { TreeViewSectionComponent } from './customapp/tree-view-section.component';
import { ChatConversationSectionComponent } from './customapp/chat-conversation-section.component';
import { IconsSectionComponent } from './customapp/icons-section.component';
import { RectangleSectionComponent } from './customapp/rectangle-section.component';
import { OkButtonSectionComponent } from './customapp/ok-button-section.component';

@NgModule({
    declarations: [
        AppComponent,
        CustomAppComponent,
        SubContainerComponent,
        OverviewSectionComponent,
        AnchorSectionComponent,
        BannerSectionComponent,
        BreadcrumbSectionComponent,
        ButtonsSectionComponent,
        AnchorButtonsSectionComponent,
        ToggleButtonsSectionComponent,
        CardSectionComponent,
        CardButtonSectionComponent,
        CheckboxSectionComponent,
        ChipSectionComponent,
        RadioButtonsSectionComponent,
        DialogSectionComponent,
        DrawerSectionComponent,
        MenuSectionComponent,
        MenuButtonSectionComponent,
        NumberFieldSectionComponent,
        SelectSectionComponent,
        ComboboxSectionComponent,
        RichTextEditorSectionComponent,
        RichTextViewerSectionComponent,
        SpinnerSectionComponent,
        SwitchSectionComponent,
        TableSectionComponent,
        DelayedHierarchyTableSectionComponent,
        TabsSectionComponent,
        AnchorTabsSectionComponent,
        TextAreaSectionComponent,
        TextFieldSectionComponent,
        ToolbarSectionComponent,
        TooltipSectionComponent,
        TreeViewSectionComponent,
        ChatConversationSectionComponent,
        IconsSectionComponent,
        RectangleSectionComponent,
        OkButtonSectionComponent
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
        NimbleChipModule,
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
        NimbleIconPencilToRectangleModule,
        NimbleIconMessagesSparkleModule,
        OkButtonModule,
        SprightChatConversationModule,
        SprightChatInputModule,
        SprightChatMessageInboundModule,
        SprightChatMessageOutboundModule,
        SprightChatMessageSystemModule,
        SprightIconWorkItemCalendarWeekDirective,
        SprightRectangleModule,
        NimbleStepperModule,
        NimbleStepModule,
        NimbleAnchorStepModule,
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
