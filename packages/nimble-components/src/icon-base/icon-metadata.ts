import type * as IconsNamespace from '../icons/all-icons';

type IconName = keyof typeof IconsNamespace;

interface IconMetadata {
    tags: string[];
}

export const iconMetadata: {
    readonly [key in IconName]: IconMetadata;
} = {
    /* eslint-disable @typescript-eslint/naming-convention */
    AddIcon: {
        tags: ['add-input-field']
    },
    ArrowDownRightAndArrowUpLeftIcon: {
        tags: ['resize', 'collapse']
    },
    ArrowExpanderDownIcon: {
        tags: []
    },
    ArrowExpanderLeftIcon: {
        tags: []
    },
    ArrowExpanderRightIcon: {
        tags: []
    },
    ArrowExpanderUpIcon: {
        tags: []
    },
    ArrowLeftFromLineIcon: {
        tags: ['logout']
    },
    ArrowPartialRotateLeftIcon: {
        tags: ['reset']
    },
    ArrowRightToLineIcon: {
        tags: ['login']
    },
    ArrowRotateRightIcon: {
        tags: ['refresh']
    },
    ArrowURotateLeftIcon: {
        tags: ['update']
    },
    ArrowUpLeftAndArrowDownRightIcon: {
        tags: ['resize', 'expand']
    },
    ArrowsMaximizeIcon: {
        tags: ['resize', 'fullscreen']
    },
    ArrowsRepeatIcon: {
        tags: ['status', 'looping']
    },
    BarsIcon: {
        tags: ['hamburger-menu']
    },
    BellIcon: {
        tags: ['status', 'alarm']
    },
    BellAndCommentIcon: {
        tags: ['alarm', 'notification']
    },
    BellCircleIcon: {
        tags: ['alarm']
    },
    BellSolidCircleIcon: {
        tags: ['alarm']
    },
    BlockWithRibbonIcon: {
        tags: ['certificate']
    },
    CalendarIcon: {
        tags: []
    },
    ChartDiagramIcon: {
        tags: ['oidc']
    },
    ChartDiagramChildFocusIcon: {
        tags: ['managed-systems']
    },
    ChartDiagramParentFocusIcon: {
        tags: ['manager-asset']
    },
    ChartDiagramParentFocusTwoChildIcon: {
        tags: ['assets']
    },
    CheckIcon: {
        tags: ['status', 'alarm-acknowledged']
    },
    CheckDotIcon: {
        tags: ['status', 'done']
    },
    CircleIcon: {
        tags: ['status', 'connected']
    },
    CircleBrokenIcon: {
        tags: ['status', 'disconnected']
    },
    CircleCheckIcon: {
        tags: ['status', 'acknowledged']
    },
    CirclePartialBrokenIcon: {
        tags: ['status', 'partially-connected']
    },
    CircleSlashIcon: {
        tags: ['status', 'blocked']
    },
    CircleXIcon: {
        tags: ['status', 'terminated']
    },
    ClipboardIcon: {
        tags: []
    },
    ClockIcon: {
        tags: ['time']
    },
    ClockCogIcon: {
        tags: ['time-settings']
    },
    ClockTriangleIcon: {
        tags: ['status', 'timed-out']
    },
    CloneIcon: {
        tags: ['duplicate']
    },
    CloudUploadIcon: {
        tags: []
    },
    CloudWithArrowIcon: {
        tags: ['cloud-connector']
    },
    CogIcon: {
        tags: ['details', 'settings']
    },
    CogDatabaseIcon: {
        tags: ['admin', 'administration']
    },
    CogDatabaseInsetIcon: {
        tags: ['admin', 'administration']
    },
    CogSmallCogIcon: {
        tags: ['system-manager']
    },
    CogZoomedIcon: {
        tags: ['data-indexing']
    },
    CommentIcon: {
        tags: ['notes', 'alarm-notes', 'speech', 'bubble']
    },
    ComputerAndMonitorIcon: {
        tags: ['devices-and-interfaces']
    },
    CopyIcon: {
        tags: ['clipboard']
    },
    CopyTextIcon: {
        tags: ['clipboard']
    },
    DashboardBuilderIcon: {
        tags: []
    },
    DashboardBuilderLegendIcon: {
        tags: []
    },
    DashboardBuilderTemplatesIcon: {
        tags: []
    },
    DashboardBuilderTileIcon: {
        tags: []
    },
    DatabaseIcon: {
        tags: ['measurement-data-analysis']
    },
    DatabaseCheckIcon: {
        tags: ['system-state-manager']
    },
    DesktopIcon: {
        tags: ['monitor']
    },
    DonutChartIcon: {
        tags: []
    },
    DotSolidDotStrokeIcon: {
        tags: ['status', 'header']
    },
    DownloadIcon: {
        tags: []
    },
    ElectronicChipZoomedIcon: {
        tags: ['data-preparation']
    },
    ExclamationMarkIcon: {
        tags: ['error', 'warning']
    },
    EyeIcon: {
        tags: ['details', 'view']
    },
    FancyAIcon: {
        tags: ['tdms-string-channel']
    },
    FileIcon: {
        tags: ['file-tdms']
    },
    FileDrawerIcon: {
        tags: ['box', 'repository-manager']
    },
    FileSearchIcon: {
        tags: ['file-viewer']
    },
    FilterIcon: {
        tags: []
    },
    FloppyDiskCheckmarkIcon: {
        tags: ['save', 'no-unsaved-changed']
    },
    FloppyDiskStarArrowRightIcon: {
        tags: ['save', 'autosave']
    },
    FloppyDiskThreeDotsIcon: {
        tags: ['save', 'in-progress']
    },
    FolderIcon: {
        tags: ['ldap']
    },
    FolderOpenIcon: {
        tags: ['browse']
    },
    ForwardSlashIcon: {
        tags: []
    },
    FourDotsSquareIcon: {
        tags: ['knurling']
    },
    FunctionIcon: {
        tags: ['data-analyzer']
    },
    GaugeSimpleIcon: {
        tags: ['widget']
    },
    GridThreeByThreeIcon: {
        tags: ['chart']
    },
    GridTwoByTwoIcon: {
        tags: ['custom-applications']
    },
    HammerIcon: {
        tags: ['operation']
    },
    HashtagIcon: {
        tags: ['number']
    },
    HomeIcon: {
        tags: []
    },
    HourglassIcon: {
        tags: ['history', 'timer']
    },
    IndeterminantCheckboxIcon: {
        tags: ['selection']
    },
    InfoIcon: {
        tags: []
    },
    InfoCircleIcon: {
        tags: []
    },
    KeyIcon: {
        tags: ['access-control', 'active-directory']
    },
    LaptopIcon: {
        tags: []
    },
    LayerGroupIcon: {
        tags: ['jobs']
    },
    LightningBoltIcon: {
        tags: ['active-jobs']
    },
    LinkIcon: {
        tags: []
    },
    LinkCancelIcon: {
        tags: ['unlink']
    },
    ListIcon: {
        tags: ['bullet', 'merged-view']
    },
    ListTreeIcon: {
        tags: ['tree-view']
    },
    ListTreeDatabaseIcon: {
        tags: ['measurement-data-analysis']
    },
    LockIcon: {
        tags: ['security']
    },
    MagnifyingGlassIcon: {
        tags: ['search']
    },
    MarkdownIcon: {
        tags: []
    },
    MinusIcon: {
        tags: ['mixed-checkbox']
    },
    MinusWideIcon: {
        tags: []
    },
    MobileIcon: {
        tags: ['phone']
    },
    NotebookIcon: {
        tags: []
    },
    PasteIcon: {
        tags: ['clipboard']
    },
    PencilIcon: {
        tags: ['edit']
    },
    PotWithLidIcon: {
        tags: ['box', 'utilities']
    },
    QuestionIcon: {
        tags: ['help']
    },
    RunningArrowIcon: {
        tags: ['status', 'running']
    },
    ServerIcon: {
        tags: ['analysis', 'automation']
    },
    ShareSquareIcon: {
        tags: ['export']
    },
    ShieldCheckIcon: {
        tags: ['secure']
    },
    ShieldXmarkIcon: {
        tags: ['insecure']
    },
    SignalBarsIcon: {
        tags: ['tdms-channel-group']
    },
    SineGraphIcon: {
        tags: ['graph']
    },
    SkipArrowIcon: {
        tags: ['status', 'skipped']
    },
    SpinnerIcon: {
        tags: ['in-progress']
    },
    SquareCheckIcon: {
        tags: ['test-insights']
    },
    SquareTIcon: {
        tags: ['static-text']
    },
    TIcon: {
        tags: ['text']
    },
    TabletIcon: {
        tags: []
    },
    TagIcon: {
        tags: []
    },
    TagsIcon: {
        tags: ['tag-query']
    },
    TargetCrosshairsIcon: {
        tags: ['calibrate']
    },
    TargetCrosshairsProgressIcon: {
        tags: ['calibrate', 'self-calibrate']
    },
    ThreeDotsLineIcon: {
        tags: ['ellipsis', 'options']
    },
    ThumbtackIcon: {
        tags: []
    },
    TileSizeIcon: {
        tags: []
    },
    TimesIcon: {
        tags: ['close']
    },
    TrashIcon: {
        tags: ['clear', 'close', 'delete', 'remove', 'x']
    },
    TriangleIcon: {
        tags: ['status', 'alarm-active']
    },
    TrueFalseRectangleIcon: {
        tags: ['tdms-boolean-channel']
    },
    UnlinkIcon: {
        tags: ['link-broken']
    },
    UnlockIcon: {
        tags: []
    },
    UploadIcon: {
        tags: []
    },
    UserIcon: {
        tags: ['admin', 'account']
    },
    WatchIcon: {
        tags: ['status', 'waiting']
    },
    WaveformIcon: {
        tags: ['tdms-waveform-channel']
    },
    WebviCustomIcon: {
        tags: ['gweb']
    },
    WebviHostIcon: {
        tags: ['gweb']
    },
    WindowCodeIcon: {
        tags: ['http-api']
    },
    WindowTextIcon: {
        tags: ['manual']
    },
    WrenchHammerIcon: {
        tags: ['status', 'custom']
    },
    XmarkIcon: {
        tags: ['status', 'fail']
    },
    XmarkCheckIcon: {
        tags: ['self-test']
    }
    /* eslint-enable @typescript-eslint/naming-convention */
};
