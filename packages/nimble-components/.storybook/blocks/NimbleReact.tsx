import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';

import { Anchor } from '../../src/anchor';
import { AnchorButton } from '../../src/anchor-button';
import { AnchorMenuItem } from '../../src/anchor-menu-item';
import { AnchorTab } from '../../src/anchor-tab';
import { AnchorTabs } from '../../src/anchor-tabs';
import { AnchorTreeItem } from '../../src/anchor-tree-item';
import { AnchoredRegion } from '../../src/anchored-region';
import { Banner } from '../../src/banner';
import { Breadcrumb } from '../../src/breadcrumb';
import { BreadcrumbItem } from '../../src/breadcrumb-item';
import { Button } from '../../src/button';
import { CardButton } from '../../src/card-button';
import { Checkbox } from '../../src/checkbox';
import { Combobox } from '../../src/combobox';
import { Dialog } from '../../src/dialog';
import { Drawer } from '../../src/drawer';
import {
    IconAdd,
    IconArrowDown,
    IconArrowDownRightAndArrowUpLeft,
    IconArrowExpanderDown,
    IconArrowExpanderLeft,
    IconArrowExpanderRight,
    IconArrowExpanderUp,
    IconArrowLeftFromLine,
    IconArrowPartialRotateLeft,
    IconArrowRightToLine,
    IconArrowRotateRight,
    IconArrowURotateLeft,
    IconArrowUp,
    IconArrowUpLeftAndArrowDownRight,
    IconArrowsMaximize,
    IconArrowsRepeat,
    IconBars,
    IconBell,
    IconBellAndComment,
    IconBellCircle,
    IconBellSolidCircle,
    IconBlockWithRibbon,
    IconBoldB,
    IconBookMagnifyingGlass,
    IconCalendar,
    IconChartDiagram,
    IconChartDiagramChildFocus,
    IconChartDiagramParentFocus,
    IconChartDiagramParentFocusTwoChild,
    IconCheck,
    IconCheckDot,
    IconCheckLarge,
    IconCircle,
    IconCircleBroken,
    IconCircleCheck,
    IconCircleFilled,
    IconCirclePartialBroken,
    IconCircleSlash,
    IconCircleX,
    IconClipboard,
    IconClock,
    IconClockCog,
    IconClockExclamation,
    IconClockTriangle,
    IconClone,
    IconCloud,
    IconCloudUpload,
    IconCloudWithArrow,
    IconCog,
    IconCogDatabase,
    IconCogDatabaseInset,
    IconCogSmallCog,
    IconCogZoomed,
    IconComment,
    IconComputerAndMonitor,
    IconCopy,
    IconCopyText,
    IconDashboardBuilder,
    IconDashboardBuilderLegend,
    IconDashboardBuilderTemplates,
    IconDashboardBuilderTile,
    IconDatabase,
    IconDatabaseCheck,
    IconDesktop,
    IconDonutChart,
    IconDotSolidDotStroke,
    IconDotSolidDotStrokeMeasurement,
    IconDownRightFromSquare,
    IconDownload,
    IconElectronicChipZoomed,
    IconExclamationMark,
    IconEye,
    IconFancyA,
    IconFile,
    IconFileArrowCurvedRight,
    IconFileDrawer,
    IconFileSearch,
    IconFilter,
    IconFloppyDisk,
    IconFloppyDiskCheckmark,
    IconFloppyDiskStarArrowRight,
    IconFloppyDiskThreeDots,
    IconFolder,
    IconFolderOpen,
    IconForwardSlash,
    IconFourDotsSquare,
    IconFunction,
    IconGaugeSimple,
    IconGridThreeByThree,
    IconGridTwoByTwo,
    IconHammer,
    IconHashtag,
    IconHome,
    IconHourglass,
    IconIndent,
    IconIndeterminantCheckbox,
    IconInfo,
    IconInfoCircle,
    IconItalicI,
    IconKey,
    IconLaptop,
    IconLayerGroup,
    IconLightningBolt,
    IconLink,
    IconLinkCancel,
    IconList,
    IconListTree,
    IconListTreeDatabase,
    IconLock,
    IconMagnifyingGlass,
    IconMarkdown,
    IconMinus,
    IconMinusWide,
    IconMobile,
    IconNotebook,
    IconNumberList,
    IconOutdent,
    IconPaste,
    IconPencil,
    IconPotWithLid,
    IconQuestion,
    IconRunningArrow,
    IconServer,
    IconShareNodes,
    IconShieldCheck,
    IconShieldXmark,
    IconSignalBars,
    IconSineGraph,
    IconSkipArrow,
    IconSpinner,
    IconSquareCheck,
    IconSquareT,
    IconT,
    IconTablet,
    IconTag,
    IconTags,
    IconTargetCrosshairs,
    IconTargetCrosshairsProgress,
    IconThreeDotsLine,
    IconThreeVerticalLines,
    IconThumbtack,
    IconTileSize,
    IconTimes,
    IconTrash,
    IconTriangle,
    IconTriangleFilled,
    IconTriangleTwoLinesHorizontal,
    IconTrueFalseRectangle,
    IconTwoSquaresInBrackets,
    IconTwoTrianglesBetweenLines,
    IconUnlink,
    IconUnlock,
    IconUpRightFromSquare,
    IconUpload,
    IconUser,
    IconWatch,
    IconWaveform,
    IconWebviCustom,
    IconWebviHost,
    IconWindowCode,
    IconWindowText,
    IconWrenchHammer,
    IconXmark,
    IconXmarkCheck
} from '../../src/icons/all-icons';

import { LabelProviderCore } from '../../src/label-provider/core';
import { LabelProviderTable } from '../../src/label-provider/table';
import { ListOption } from '../../src/list-option';
import { MappingText } from '../../src/mapping/text';
import { MappingIcon } from '../../src/mapping/icon';
import { MappingSpinner } from '../../src/mapping/spinner';
import { Menu } from '../../src/menu';
import { MenuButton } from '../../src/menu-button';
import { MenuItem } from '../../src/menu-item';
import { NumberField } from '../../src/number-field';
import { Radio } from '../../src/radio';
import { RadioGroup } from '../../src/radio-group';
import { RichTextEditor } from '../../src/rich-text/editor';
import { RichTextViewer } from '../../src/rich-text/viewer';
import { Select } from '../../src/select';
import { Spinner } from '../../src/spinner';
import { Switch } from '../../src/switch';
import { Tab } from '../../src/tab';
import { TabPanel } from '../../src/tab-panel';
import { Table } from '../../src/table';
import { TableColumnAnchor } from '../../src/table-column/anchor';
import { TableColumnDateText } from '../../src/table-column/date-text';
import { TableColumnEnumText } from '../../src/table-column/enum-text';
import { TableColumnNumberText } from '../../src/table-column/number-text';
import { TableColumnIcon } from '../../src/table-column/icon';
import { TableColumnText } from '../../src/table-column/text';
import { Tabs } from '../../src/tabs';
import { TabsToolbar } from '../../src/tabs-toolbar';
import { TextArea } from '../../src/text-area';
import { TextField } from '../../src/text-field';
import { ThemeProvider } from '../../src/theme-provider';
import { ToggleButton } from '../../src/toggle-button';
import { Toolbar } from '../../src/toolbar';
import { Tooltip } from '../../src/tooltip';
import { TreeItem } from '../../src/tree-item';
import { TreeView } from '../../src/tree-view';
import { WaferMap } from '../../src/wafer-map';

const { wrap } = provideReactWrapper(React);

export const NimbleAnchor = wrap(Anchor);
export const NimbleAnchorButton = wrap(AnchorButton);
export const NimbleAnchorMenuItem = wrap(AnchorMenuItem);
export const NimbleAnchorTab = wrap(AnchorTab);
export const NimbleAnchorTabs = wrap(AnchorTabs);
export const NimbleAnchorTreeItem = wrap(AnchorTreeItem);
export const NimbleAnchoredRegion = wrap(AnchoredRegion);
export const NimbleBanner = wrap(Banner);
export const NimbleBreadcrumb = wrap(Breadcrumb);
export const NimbleBreadcrumbItem = wrap(BreadcrumbItem);
export const NimbleButton = wrap(Button);
export const NimbleCardButton = wrap(CardButton);
export const NimbleCheckbox = wrap(Checkbox);
export const NimbleCombobox = wrap(Combobox);
export const NimbleDialog = wrap(Dialog);
export const NimbleDrawer = wrap(Drawer);
export const NimbleIconAdd = wrap(IconAdd);
export const NimbleIconArrowDown = wrap(IconArrowDown);
export const NimbleIconArrowDownRightAndArrowUpLeft = wrap(
    IconArrowDownRightAndArrowUpLeft
);
export const NimbleIconArrowExpanderDown = wrap(IconArrowExpanderDown);
export const NimbleIconArrowExpanderLeft = wrap(IconArrowExpanderLeft);
export const NimbleIconArrowExpanderRight = wrap(IconArrowExpanderRight);
export const NimbleIconArrowExpanderUp = wrap(IconArrowExpanderUp);
export const NimbleIconArrowLeftFromLine = wrap(IconArrowLeftFromLine);
export const NimbleIconArrowPartialRotateLeft = wrap(
    IconArrowPartialRotateLeft
);
export const NimbleIconArrowRightToLine = wrap(IconArrowRightToLine);
export const NimbleIconArrowRotateRight = wrap(IconArrowRotateRight);
export const NimbleIconArrowURotateLeft = wrap(IconArrowURotateLeft);
export const NimbleIconArrowUp = wrap(IconArrowUp);
export const NimbleIconArrowUpLeftAndArrowDownRight = wrap(
    IconArrowUpLeftAndArrowDownRight
);
export const NimbleIconArrowsMaximize = wrap(IconArrowsMaximize);
export const NimbleIconArrowsRepeat = wrap(IconArrowsRepeat);
export const NimbleIconBars = wrap(IconBars);
export const NimbleIconBell = wrap(IconBell);
export const NimbleIconBellAndComment = wrap(IconBellAndComment);
export const NimbleIconBellCircle = wrap(IconBellCircle);
export const NimbleIconBellSolidCircle = wrap(IconBellSolidCircle);
export const NimbleIconBlockWithRibbon = wrap(IconBlockWithRibbon);
export const NimbleIconBoldB = wrap(IconBoldB);
export const NimbleIconBookMagnifyingGlass = wrap(IconBookMagnifyingGlass);
export const NimbleIconCalendar = wrap(IconCalendar);
export const NimbleIconChartDiagram = wrap(IconChartDiagram);
export const NimbleIconChartDiagramChildFocus = wrap(
    IconChartDiagramChildFocus
);
export const NimbleIconChartDiagramParentFocus = wrap(
    IconChartDiagramParentFocus
);
export const NimbleIconChartDiagramParentFocusTwoChild = wrap(
    IconChartDiagramParentFocusTwoChild
);
export const NimbleIconCheck = wrap(IconCheck);
export const NimbleIconCheckDot = wrap(IconCheckDot);
export const NimbleIconCheckLarge = wrap(IconCheckLarge);
export const NimbleIconCircle = wrap(IconCircle);
export const NimbleIconCircleBroken = wrap(IconCircleBroken);
export const NimbleIconCircleCheck = wrap(IconCircleCheck);
export const NimbleIconCircleFilled = wrap(IconCircleFilled);
export const NimbleIconCirclePartialBroken = wrap(IconCirclePartialBroken);
export const NimbleIconCircleSlash = wrap(IconCircleSlash);
export const NimbleIconCircleX = wrap(IconCircleX);
export const NimbleIconClipboard = wrap(IconClipboard);
export const NimbleIconClock = wrap(IconClock);
export const NimbleIconClockCog = wrap(IconClockCog);
export const NimbleIconClockExclamation = wrap(IconClockExclamation);
export const NimbleIconClockTriangle = wrap(IconClockTriangle);
export const NimbleIconClone = wrap(IconClone);
export const NimbleIconCloud = wrap(IconCloud);
export const NimbleIconCloudUpload = wrap(IconCloudUpload);
export const NimbleIconCloudWithArrow = wrap(IconCloudWithArrow);
export const NimbleIconCog = wrap(IconCog);
export const NimbleIconCogDatabase = wrap(IconCogDatabase);
export const NimbleIconCogDatabaseInset = wrap(IconCogDatabaseInset);
export const NimbleIconCogSmallCog = wrap(IconCogSmallCog);
export const NimbleIconCogZoomed = wrap(IconCogZoomed);
export const NimbleIconComment = wrap(IconComment);
export const NimbleIconComputerAndMonitor = wrap(IconComputerAndMonitor);
export const NimbleIconCopy = wrap(IconCopy);
export const NimbleIconCopyText = wrap(IconCopyText);
export const NimbleIconDashboardBuilder = wrap(IconDashboardBuilder);
export const NimbleIconDashboardBuilderLegend = wrap(
    IconDashboardBuilderLegend
);
export const NimbleIconDashboardBuilderTemplates = wrap(
    IconDashboardBuilderTemplates
);
export const NimbleIconDashboardBuilderTile = wrap(IconDashboardBuilderTile);
export const NimbleIconDatabase = wrap(IconDatabase);
export const NimbleIconDatabaseCheck = wrap(IconDatabaseCheck);
export const NimbleIconDesktop = wrap(IconDesktop);
export const NimbleIconDonutChart = wrap(IconDonutChart);
export const NimbleIconDotSolidDotStroke = wrap(IconDotSolidDotStroke);
export const NimbleIconDotSolidDotStrokeMeasurement = wrap(
    IconDotSolidDotStrokeMeasurement
);
export const NimbleIconDownRightFromSquare = wrap(IconDownRightFromSquare);
export const NimbleIconDownload = wrap(IconDownload);
export const NimbleIconElectronicChipZoomed = wrap(IconElectronicChipZoomed);
export const NimbleIconExclamationMark = wrap(IconExclamationMark);
export const NimbleIconEye = wrap(IconEye);
export const NimbleIconFancyA = wrap(IconFancyA);
export const NimbleIconFile = wrap(IconFile);
export const NimbleIconFileArrowCurvedRight = wrap(IconFileArrowCurvedRight);
export const NimbleIconFileDrawer = wrap(IconFileDrawer);
export const NimbleIconFileSearch = wrap(IconFileSearch);
export const NimbleIconFilter = wrap(IconFilter);
export const NimbleIconFloppyDisk = wrap(IconFloppyDisk);
export const NimbleIconFloppyDiskCheckmark = wrap(IconFloppyDiskCheckmark);
export const NimbleIconFloppyDiskStarArrowRight = wrap(
    IconFloppyDiskStarArrowRight
);
export const NimbleIconFloppyDiskThreeDots = wrap(IconFloppyDiskThreeDots);
export const NimbleIconFolder = wrap(IconFolder);
export const NimbleIconFolderOpen = wrap(IconFolderOpen);
export const NimbleIconForwardSlash = wrap(IconForwardSlash);
export const NimbleIconFourDotsSquare = wrap(IconFourDotsSquare);
export const NimbleIconFunction = wrap(IconFunction);
export const NimbleIconGaugeSimple = wrap(IconGaugeSimple);
export const NimbleIconGridThreeByThree = wrap(IconGridThreeByThree);
export const NimbleIconGridTwoByTwo = wrap(IconGridTwoByTwo);
export const NimbleIconHammer = wrap(IconHammer);
export const NimbleIconHashtag = wrap(IconHashtag);
export const NimbleIconHome = wrap(IconHome);
export const NimbleIconHourglass = wrap(IconHourglass);
export const NimbleIconIndent = wrap(IconIndent);
export const NimbleIconIndeterminantCheckbox = wrap(IconIndeterminantCheckbox);
export const NimbleIconInfo = wrap(IconInfo);
export const NimbleIconInfoCircle = wrap(IconInfoCircle);
export const NimbleIconItalicI = wrap(IconItalicI);
export const NimbleIconKey = wrap(IconKey);
export const NimbleIconLaptop = wrap(IconLaptop);
export const NimbleIconLayerGroup = wrap(IconLayerGroup);
export const NimbleIconLightningBolt = wrap(IconLightningBolt);
export const NimbleIconLink = wrap(IconLink);
export const NimbleIconLinkCancel = wrap(IconLinkCancel);
export const NimbleIconList = wrap(IconList);
export const NimbleIconListTree = wrap(IconListTree);
export const NimbleIconListTreeDatabase = wrap(IconListTreeDatabase);
export const NimbleIconLock = wrap(IconLock);
export const NimbleIconMagnifyingGlass = wrap(IconMagnifyingGlass);
export const NimbleIconMarkdown = wrap(IconMarkdown);
export const NimbleIconMinus = wrap(IconMinus);
export const NimbleIconMinusWide = wrap(IconMinusWide);
export const NimbleIconMobile = wrap(IconMobile);
export const NimbleIconNotebook = wrap(IconNotebook);
export const NimbleIconNumberList = wrap(IconNumberList);
export const NimbleIconOutdent = wrap(IconOutdent);
export const NimbleIconPaste = wrap(IconPaste);
export const NimbleIconPencil = wrap(IconPencil);
export const NimbleIconPotWithLid = wrap(IconPotWithLid);
export const NimbleIconQuestion = wrap(IconQuestion);
export const NimbleIconRunningArrow = wrap(IconRunningArrow);
export const NimbleIconServer = wrap(IconServer);
export const NimbleIconShareNodes = wrap(IconShareNodes);
export const NimbleIconShieldCheck = wrap(IconShieldCheck);
export const NimbleIconShieldXmark = wrap(IconShieldXmark);
export const NimbleIconSignalBars = wrap(IconSignalBars);
export const NimbleIconSineGraph = wrap(IconSineGraph);
export const NimbleIconSkipArrow = wrap(IconSkipArrow);
export const NimbleIconSpinner = wrap(IconSpinner);
export const NimbleIconSquareCheck = wrap(IconSquareCheck);
export const NimbleIconSquareT = wrap(IconSquareT);
export const NimbleIconT = wrap(IconT);
export const NimbleIconTablet = wrap(IconTablet);
export const NimbleIconTag = wrap(IconTag);
export const NimbleIconTags = wrap(IconTags);
export const NimbleIconTargetCrosshairs = wrap(IconTargetCrosshairs);
export const NimbleIconTargetCrosshairsProgress = wrap(
    IconTargetCrosshairsProgress
);
export const NimbleIconThreeDotsLine = wrap(IconThreeDotsLine);
export const NimbleIconThreeVerticalLines = wrap(IconThreeVerticalLines);
export const NimbleIconThumbtack = wrap(IconThumbtack);
export const NimbleIconTileSize = wrap(IconTileSize);
export const NimbleIconTimes = wrap(IconTimes);
export const NimbleIconTrash = wrap(IconTrash);
export const NimbleIconTriangle = wrap(IconTriangle);
export const NimbleIconTriangleFilled = wrap(IconTriangleFilled);
export const NimbleIconTriangleTwoLinesHorizontal = wrap(
    IconTriangleTwoLinesHorizontal
);
export const NimbleIconTrueFalseRectangle = wrap(IconTrueFalseRectangle);
export const NimbleIconTwoSquaresInBrackets = wrap(IconTwoSquaresInBrackets);
export const NimbleIconTwoTrianglesBetweenLines = wrap(
    IconTwoTrianglesBetweenLines
);
export const NimbleIconUnlink = wrap(IconUnlink);
export const NimbleIconUnlock = wrap(IconUnlock);
export const NimbleIconUpRightFromSquare = wrap(IconUpRightFromSquare);
export const NimbleIconUpload = wrap(IconUpload);
export const NimbleIconUser = wrap(IconUser);
export const NimbleIconWatch = wrap(IconWatch);
export const NimbleIconWaveform = wrap(IconWaveform);
export const NimbleIconWebviCustom = wrap(IconWebviCustom);
export const NimbleIconWebviHost = wrap(IconWebviHost);
export const NimbleIconWindowCode = wrap(IconWindowCode);
export const NimbleIconWindowText = wrap(IconWindowText);
export const NimbleIconWrenchHammer = wrap(IconWrenchHammer);
export const NimbleIconXmark = wrap(IconXmark);
export const NimbleIconXmarkCheck = wrap(IconXmarkCheck);
export const NimbleLabelProviderCore = wrap(LabelProviderCore);
export const NimbleLabelProviderTable = wrap(LabelProviderTable);
export const NimbleListOption = wrap(ListOption);
export const NimbleMappingText = wrap(MappingText);
export const NimbleMappingIcon = wrap(MappingIcon);
export const NimbleMappingSpinner = wrap(MappingSpinner);
export const NimbleMenu = wrap(Menu);
export const NimbleMenuButton = wrap(MenuButton);
export const NimbleMenuItem = wrap(MenuItem);
export const NimbleNumberField = wrap(NumberField);
export const NimbleRadio = wrap(Radio);
export const NimbleRadioGroup = wrap(RadioGroup);
export const NimbleRichTextEditor = wrap(RichTextEditor);
export const NimbleRichTextViewer = wrap(RichTextViewer);
export const NimbleSelect = wrap(Select);
export const NimbleSpinner = wrap(Spinner);
export const NimbleSwitch = wrap(Switch);
export const NimbleTab = wrap(Tab);
export const NimbleTabPanel = wrap(TabPanel);
export const NimbleTable = wrap(Table);
export const NimbleTableColumnAnchor = wrap(TableColumnAnchor);
export const NimbleTableColumnDateText = wrap(TableColumnDateText);
export const NimbleTableColumnEnumText = wrap(TableColumnEnumText);
export const NimbleTableColumnNumberText = wrap(TableColumnNumberText);
export const NimbleTableColumnIcon = wrap(TableColumnIcon);
export const NimbleTableColumnText = wrap(TableColumnText);
export const NimbleTabs = wrap(Tabs);
export const NimbleTabsToolbar = wrap(TabsToolbar);
export const NimbleTextArea = wrap(TextArea);
export const NimbleTextField = wrap(TextField);
export const NimbleThemeProvider = wrap(ThemeProvider);
export const NimbleToggleButton = wrap(ToggleButton);
export const NimbleToolbar = wrap(Toolbar);
export const NimbleTooltip = wrap(Tooltip);
export const NimbleTreeItem = wrap(TreeItem);
export const NimbleTreeView = wrap(TreeView);
export const NimbleWaferMap = wrap(WaferMap);
