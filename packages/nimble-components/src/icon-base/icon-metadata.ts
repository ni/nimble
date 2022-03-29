import type * as IconsNamespace from '../icons/all-icons';

type IconName = keyof typeof IconsNamespace;

interface IconMetadata {
    tags: string[];
}

export const iconMetadata: {
    readonly [key in IconName]: IconMetadata | undefined;
} = {
    /* eslint-disable @typescript-eslint/naming-convention */
    AddIcon: {
        tags: ['add-input-field']
    },
    ArrowDownRightAndArrowUpLeftIcon: {
        tags: ['resize', 'collapse']
    },
    ArrowExpanderDownIcon: undefined,
    ArrowExpanderLeftIcon: undefined,
    ArrowExpanderRightIcon: undefined,
    ArrowExpanderUpIcon: undefined,
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
    CalendarIcon: undefined,
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
    ClipboardIcon: undefined,
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
    CloudUploadIcon: undefined,
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
    DashboardBuilderIcon: undefined,
    DashboardBuilderLegendIcon: undefined,
    DashboardBuilderTemplatesIcon: undefined,
    DashboardBuilderTileIcon: undefined,
    DatabaseIcon: {
        tags: ['measurement-data-analysis']
    },
    DatabaseCheckIcon: {
        tags: ['system-state-manager']
    },
    DesktopIcon: {
        tags: ['monitor']
    },
    DonutChartIcon: undefined,
    DotSolidDotStrokeIcon: {
        tags: ['status', 'header']
    },
    DownloadIcon: undefined,
    ElectronicChipZoomedIcon: {
        tags: ['data-preparation']
    },
    ExclamationMarkIcon: {
        tags: ['error']
    },
    EyeIcon: {
        tags: ['view']
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
    FilterIcon: undefined,
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
    ForwardSlashIcon: undefined,
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
    HomeIcon: undefined,
    HourglassIcon: {
        tags: ['history', 'timer']
    },
    IndeterminantCheckboxIcon: {
        tags: ['selection']
    },
    InfoIcon: {
        tags: ['']
    },
    InfoCircleIcon: undefined,
    KeyIcon: {
        tags: ['access-control', 'active-directory']
    },
    LaptopIcon: undefined,
    LayerGroupIcon: {
        tags: ['jobs']
    },
    LightningBoltIcon: {
        tags: ['active-jobs']
    },
    LinkIcon: undefined,
    LinkCancelIcon: undefined,
    ListIcon: {
        tags: ['merged-view']
    },
    ListTreeIcon: {
        tags: ['tree-view']
    },
    ListTreeDatabaseIcon: {
        tags: ['measurement-data-analysis']
    },
    LockIcon: undefined,
    MagnifyingGlassIcon: {
        tags: ['search']
    },
    MarkdownIcon: undefined,
    MinusIcon: {
        tags: ['mixed-checkbox']
    },
    MinusWideIcon: undefined,
    MobileIcon: undefined,
    NotebookIcon: undefined,
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
    TabletIcon: undefined,
    TagIcon: undefined,
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
        tags: ['options']
    },
    ThumbtackIcon: undefined,
    TileSizeIcon: undefined,
    TimesIcon: {
        tags: ['close']
    },
    TrashIcon: {
        tags: ['delete']
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
    UnlockIcon: undefined,
    UploadIcon: undefined,
    UserIcon: {
        tags: ['admin', 'account']
    },
    WatchIcon: {
        tags: ['status', 'waiting']
    },
    WaveformIcon: {
        tags: ['tdms-waveform-channel']
    },
    WebviCustomIcon: undefined,
    WebviHostIcon: undefined,
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
