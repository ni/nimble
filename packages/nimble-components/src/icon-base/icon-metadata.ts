import type * as IconsNamespace from '../icons/all-icons';

type IconName = keyof typeof IconsNamespace;

interface IconMetadata {
    tags: string[];
}

export const iconMetadata: {
    readonly [key in IconName]: IconMetadata;
} = {
    /* eslint-disable @typescript-eslint/naming-convention */
    IconAdd: {
        tags: ['add-input-field']
    },
    IconArrowDownRightAndArrowUpLeft: {
        tags: ['resize', 'collapse']
    },
    IconArrowExpanderDown: {
        tags: []
    },
    IconArrowExpanderLeft: {
        tags: []
    },
    IconArrowExpanderRight: {
        tags: []
    },
    IconArrowExpanderUp: {
        tags: []
    },
    IconArrowLeftFromLine: {
        tags: ['logout']
    },
    IconArrowPartialRotateLeft: {
        tags: ['reset']
    },
    IconArrowRightToLine: {
        tags: ['login']
    },
    IconArrowRotateRight: {
        tags: ['refresh']
    },
    IconArrowURotateLeft: {
        tags: ['update']
    },
    IconArrowUpLeftAndArrowDownRight: {
        tags: ['resize', 'expand']
    },
    IconArrowsMaximize: {
        tags: ['resize', 'fullscreen']
    },
    IconArrowsRepeat: {
        tags: ['status', 'looping']
    },
    IconBars: {
        tags: ['hamburger-menu']
    },
    IconBell: {
        tags: ['status', 'alarm']
    },
    IconBellAndComment: {
        tags: ['alarm', 'notification']
    },
    IconBellCircle: {
        tags: ['alarm']
    },
    IconBellSolidCircle: {
        tags: ['alarm']
    },
    IconBlockWithRibbon: {
        tags: ['certificate']
    },
    IconCalendar: {
        tags: []
    },
    IconChartDiagram: {
        tags: ['oidc']
    },
    IconChartDiagramChildFocus: {
        tags: ['managed-systems']
    },
    IconChartDiagramParentFocus: {
        tags: ['manager-asset']
    },
    IconChartDiagramParentFocusTwoChild: {
        tags: ['assets']
    },
    IconCheck: {
        tags: ['status', 'alarm-acknowledged']
    },
    IconCheckDot: {
        tags: ['status', 'done']
    },
    IconCircle: {
        tags: ['status', 'connected']
    },
    IconCircleBroken: {
        tags: ['status', 'disconnected']
    },
    IconCircleCheck: {
        tags: ['status', 'acknowledged']
    },
    IconCirclePartialBroken: {
        tags: ['status', 'partially-connected']
    },
    IconCircleSlash: {
        tags: ['status', 'blocked']
    },
    IconCircleX: {
        tags: ['status', 'terminated']
    },
    IconClipboard: {
        tags: []
    },
    IconClock: {
        tags: ['time']
    },
    IconClockCog: {
        tags: ['time-settings']
    },
    IconClockTriangle: {
        tags: ['status', 'timed-out']
    },
    IconClone: {
        tags: ['duplicate']
    },
    IconCloudUpload: {
        tags: []
    },
    IconCloudWithArrow: {
        tags: ['cloud-connector']
    },
    IconCog: {
        tags: ['details', 'settings']
    },
    IconCogDatabase: {
        tags: ['admin', 'administration']
    },
    IconCogDatabaseInset: {
        tags: ['admin', 'administration']
    },
    IconCogSmallCog: {
        tags: ['system-manager']
    },
    IconCogZoomed: {
        tags: ['data-indexing']
    },
    IconComment: {
        tags: ['notes', 'alarm-notes', 'speech', 'bubble']
    },
    IconComputerAndMonitor: {
        tags: ['devices-and-interfaces']
    },
    IconCopy: {
        tags: ['clipboard']
    },
    IconCopyText: {
        tags: ['clipboard']
    },
    IconDashboardBuilder: {
        tags: []
    },
    IconDashboardBuilderLegend: {
        tags: []
    },
    IconDashboardBuilderTemplates: {
        tags: []
    },
    IconDashboardBuilderTile: {
        tags: []
    },
    IconDatabase: {
        tags: ['measurement-data-analysis']
    },
    IconDatabaseCheck: {
        tags: ['system-state-manager']
    },
    IconDesktop: {
        tags: ['monitor']
    },
    IconDonutChart: {
        tags: []
    },
    IconDotSolidDotStroke: {
        tags: ['status', 'header']
    },
    IconDownload: {
        tags: []
    },
    IconElectronicChipZoomed: {
        tags: ['data-preparation']
    },
    IconExclamationMark: {
        tags: ['error', 'warning']
    },
    IconEye: {
        tags: ['details', 'view']
    },
    IconFancyA: {
        tags: ['tdms-string-channel']
    },
    IconFile: {
        tags: ['file-tdms']
    },
    IconFileDrawer: {
        tags: ['box', 'repository-manager']
    },
    IconFileSearch: {
        tags: ['file-viewer']
    },
    IconFilter: {
        tags: []
    },
    IconFloppyDiskCheckmark: {
        tags: ['save', 'no-unsaved-changed']
    },
    IconFloppyDiskStarArrowRight: {
        tags: ['save', 'autosave']
    },
    IconFloppyDiskThreeDots: {
        tags: ['save', 'in-progress']
    },
    IconFolder: {
        tags: ['ldap']
    },
    IconFolderOpen: {
        tags: ['browse']
    },
    IconForwardSlash: {
        tags: []
    },
    IconFourDotsSquare: {
        tags: ['knurling']
    },
    IconFunction: {
        tags: ['data-analyzer']
    },
    IconGaugeSimple: {
        tags: ['widget']
    },
    IconGridThreeByThree: {
        tags: ['chart']
    },
    IconGridTwoByTwo: {
        tags: ['custom-applications']
    },
    IconHammer: {
        tags: ['operation']
    },
    IconHashtag: {
        tags: ['number']
    },
    IconHome: {
        tags: []
    },
    IconHourglass: {
        tags: ['history', 'timer']
    },
    IconIndeterminantCheckbox: {
        tags: ['selection']
    },
    IconInfo: {
        tags: []
    },
    IconInfoCircle: {
        tags: []
    },
    IconKey: {
        tags: ['access-control', 'active-directory']
    },
    IconLaptop: {
        tags: []
    },
    IconLayerGroup: {
        tags: ['jobs']
    },
    IconLightningBolt: {
        tags: ['active-jobs']
    },
    IconLink: {
        tags: []
    },
    IconLinkCancel: {
        tags: ['unlink']
    },
    IconList: {
        tags: ['bullet', 'merged-view']
    },
    IconListTree: {
        tags: ['tree-view']
    },
    IconListTreeDatabase: {
        tags: ['measurement-data-analysis']
    },
    IconLock: {
        tags: ['security']
    },
    IconMagnifyingGlass: {
        tags: ['search']
    },
    IconMarkdown: {
        tags: []
    },
    IconMinus: {
        tags: ['mixed-checkbox']
    },
    IconMinusWide: {
        tags: []
    },
    IconMobile: {
        tags: ['phone']
    },
    IconNotebook: {
        tags: []
    },
    IconPaste: {
        tags: ['clipboard']
    },
    IconPencil: {
        tags: ['edit']
    },
    IconPotWithLid: {
        tags: ['box', 'utilities']
    },
    IconQuestion: {
        tags: ['help']
    },
    IconRunningArrow: {
        tags: ['status', 'running']
    },
    IconServer: {
        tags: ['analysis', 'automation']
    },
    IconShareSquare: {
        tags: ['export']
    },
    IconShieldCheck: {
        tags: ['secure']
    },
    IconShieldXmark: {
        tags: ['insecure']
    },
    IconSignalBars: {
        tags: ['tdms-channel-group']
    },
    IconSineGraph: {
        tags: ['graph']
    },
    IconSkipArrow: {
        tags: ['status', 'skipped']
    },
    IconSpinner: {
        tags: ['in-progress']
    },
    IconSquareCheck: {
        tags: ['test-insights']
    },
    IconSquareT: {
        tags: ['static-text']
    },
    IconT: {
        tags: ['text']
    },
    IconTablet: {
        tags: []
    },
    IconTag: {
        tags: []
    },
    IconTags: {
        tags: ['tag-query']
    },
    IconTargetCrosshairs: {
        tags: ['calibrate']
    },
    IconTargetCrosshairsProgress: {
        tags: ['calibrate', 'self-calibrate']
    },
    IconThreeDotsLine: {
        tags: ['ellipsis', 'options']
    },
    IconThumbtack: {
        tags: []
    },
    IconTileSize: {
        tags: []
    },
    IconTimes: {
        tags: ['close']
    },
    IconTrash: {
        tags: ['clear', 'close', 'delete', 'remove', 'x']
    },
    IconTriangle: {
        tags: ['status', 'alarm-active']
    },
    IconTrueFalseRectangle: {
        tags: ['tdms-boolean-channel']
    },
    IconUnlink: {
        tags: ['link-broken']
    },
    IconUnlock: {
        tags: []
    },
    IconUpload: {
        tags: []
    },
    IconUser: {
        tags: ['admin', 'account']
    },
    IconWatch: {
        tags: ['status', 'waiting']
    },
    IconWaveform: {
        tags: ['tdms-waveform-channel']
    },
    IconWebviCustom: {
        tags: ['gweb']
    },
    IconWebviHost: {
        tags: ['gweb']
    },
    IconWindowCode: {
        tags: ['http-api']
    },
    IconWindowText: {
        tags: ['manual']
    },
    IconWrenchHammer: {
        tags: ['status', 'custom']
    },
    IconXmark: {
        tags: ['status', 'fail']
    },
    IconXmarkCheck: {
        tags: ['self-test']
    }
    /* eslint-enable @typescript-eslint/naming-convention */
};
