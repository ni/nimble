import type * as IconsNamespace from '../../icons/all-icons';

type IconName = keyof typeof IconsNamespace;

interface IconMetadata {
    tags: string[];
}

export const iconMetadata: Partial<{
    readonly [key in IconName]: IconMetadata;
}> = {
    /* eslint-disable @typescript-eslint/naming-convention */
    IconAdd: {
        tags: ['add input field']
    },
    IconMessageBot: {
        tags: ['assistance', 'information', 'help']
    },
    IconArrowDown: {
        tags: ['sort', 'arrow', 'down', 'descending']
    },
    IconArrowDownRectangle: {
        tags: ['install', 'software', 'drive', 'package', 'box']
    },
    IconArrowDownLeftAndArrowUpRight: {
        tags: ['collapse', 'shrink', 'reduce size']
    },
    IconArrowDownRightAndArrowUpLeft: {
        tags: ['resize', 'collapse']
    },
    IconArrowDownTwoRectangles: {
        tags: ['panes', 'open', 'close', 'expand', 'collapse', 'bottom', 'top']
    },
    IconArrowUpRightAndArrowDownLeft: {
        tags: ['expand', 'grow', 'enlarge size']
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
    IconArrowInCircle: {
        tags: ['move in']
    },
    IconArrowLeftFromLine: {
        tags: ['logout']
    },
    IconArrowLeftTwoRectangles: {
        tags: ['panes', 'open', 'close', 'expand', 'collapse', 'side']
    },
    IconArrowOutCircle: {
        tags: ['move out']
    },
    IconArrowPartialRotateLeft: {
        tags: ['reset']
    },
    IconArrowRightThin: {
        tags: ['link', 'open']
    },
    IconArrowRightToLine: {
        tags: ['login']
    },
    IconArrowRightTwoRectangles: {
        tags: ['panes', 'open', 'close', 'expand', 'collapse', 'side']
    },
    IconArrowRotateRight: {
        tags: ['refresh']
    },
    IconArrowUpLeftAndArrowDownRight: {
        tags: ['resize', 'expand']
    },
    IconArrowUpRectangle: {
        tags: ['uninstall', 'software', 'drive', 'package', 'box']
    },
    IconArrowUpRightFromSquare: {
        tags: ['open', 'external', 'link']
    },
    IconArrowUpTwoRectangles: {
        tags: ['panes', 'open', 'close', 'expand', 'collapse', 'bottom', 'top']
    },
    IconArrowULeft: {
        tags: ['undo', 'revert', 'back']
    },
    IconArrowURight: {
        tags: ['redo', 'revert', 'forward']
    },
    IconArrowUUp: {
        tags: ['update']
    },
    IconArrowsMaximize: {
        tags: ['resize', 'fullscreen']
    },
    IconArrowsRepeat: {
        tags: ['status', 'looping']
    },
    IconArrowsRotateReverseDot: {
        tags: ['automatic', 'automate', 'auto']
    },
    IconArrowUp: {
        tags: ['sort', 'arrow', 'up', 'ascending']
    },
    IconAsterisk: {
        tags: ['star', 'required']
    },
    IconAt: {
        tags: ['@', 'email', 'handle', 'mention']
    },
    IconBars: {
        tags: ['hamburger menu']
    },
    IconBell: {
        tags: ['status', 'alarm']
    },
    IconBellAndComment: {
        tags: ['deprecated - prefer icon bell and message']
    },
    IconBellAndMessage: {
        tags: ['alarm', 'notification', 'comment']
    },
    IconBellCheck: {
        tags: ['acknowledged', 'alarm']
    },
    IconBellCircle: {
        tags: ['alarm']
    },
    IconBellOn: {
        tags: ['set', 'urgent', 'notification', 'alarm']
    },
    IconBellSolidCircle: {
        tags: ['alarm']
    },
    IconBlockWithRibbon: {
        tags: ['certificate']
    },
    IconBoldB: {
        tags: []
    },
    IconBookMagnifyingGlass: {
        tags: ['analyze']
    },
    IconCalendarArrowsRotateReverseDot: {
        tags: ['auto-schedule', 'automate', 'automatic']
    },
    IconCalendarCheckLines: {
        tags: ['test', 'plan', 'schedule']
    },
    IconCalendarCircleExclamation: {
        tags: ['conflict', 'schedule']
    },
    IconCalendarClock: {
        tags: ['time', 'schedule']
    },
    IconCalendarDay: {
        tags: ['date']
    },
    IconCalendarDays: {
        tags: ['month', 'schedule']
    },
    IconCalendarLines: {
        tags: ['agenda']
    },
    IconCalendarRectangle: {
        tags: ['year']
    },
    IconCalendarDayOutline: {
        tags: ['today']
    },
    IconCalendarWeek: {
        tags: []
    },
    IconChartDiagram: {
        tags: ['oidc']
    },
    IconChartDiagramChildFocus: {
        tags: ['managed systems']
    },
    IconChartDiagramParentFocus: {
        tags: ['manager asset']
    },
    IconChartDiagramParentFocusTwoChild: {
        tags: ['assets']
    },
    IconCheck: {
        tags: ['status', 'success', 'alarm acknowledged', 'approve']
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
        tags: ['status', 'acknowledged', 'ready']
    },
    IconCircleFilled: {
        tags: []
    },
    IconCircleMinus: {
        tags: ['not set', 'dash', 'hyphen']
    },
    IconCirclePartialBroken: {
        tags: ['status', 'partially connected']
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
        tags: ['time settings']
    },
    IconClockExclamation: {
        tags: ['expire']
    },
    IconClockTriangle: {
        tags: ['status', 'timed out']
    },
    IconClone: {
        tags: ['duplicate']
    },
    IconCloud: {
        tags: []
    },
    IconCloudUpload: {
        tags: []
    },
    IconCloudWithArrow: {
        tags: ['cloud connector']
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
        tags: ['system manager']
    },
    IconCogZoomed: {
        tags: ['data indexing']
    },
    IconComment: {
        tags: ['deprecated - prefer icon message']
    },
    IconComputerAndMonitor: {
        tags: ['devices and interfaces']
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
        tags: ['measurement data analysis']
    },
    IconDatabaseCheck: {
        tags: ['system state manager']
    },
    IconDebug: {
        tags: ['troubleshoot']
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
    IconDotSolidDotStrokeMeasurement: {
        tags: ['status', 'measurement']
    },
    IconDownload: {
        tags: []
    },
    IconDownRightFromSquare: {
        tags: ['import']
    },
    IconElectronicChipZoomed: {
        tags: ['data preparation']
    },
    IconExclamationMark: {
        tags: ['error', 'warning']
    },
    IconEye: {
        tags: ['details', 'view']
    },
    IconEyeDash: {
        tags: ['hide', 'show', 'view', 'remove']
    },
    IconFancyA: {
        tags: ['tdms string channel']
    },
    IconFile: {
        tags: ['file tdms']
    },
    IconFileArrowCurvedRight: {
        tags: ['export', 'extract']
    },
    IconFileDrawer: {
        tags: ['box', 'repository manager']
    },
    IconFileSearch: {
        tags: ['file viewer']
    },
    IconFilter: {
        tags: []
    },
    IconFloppyDisk: {
        tags: ['save']
    },
    IconFloppyDiskCheckmark: {
        tags: ['save', 'no unsaved changed']
    },
    IconFloppyDiskPen: {
        tags: ['save as', 'pencil']
    },
    IconFloppyDiskStarArrowRight: {
        tags: ['save', 'autosave']
    },
    IconFloppyDiskThreeDots: {
        tags: ['save', 'in progress']
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
        tags: ['data analyzer']
    },
    IconGaugeSimple: {
        tags: ['widget']
    },
    IconGridThreeByThree: {
        tags: ['chart']
    },
    IconGridTwoByTwo: {
        tags: ['custom applications']
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
    IconHorizontalTriangleOutline: {
        tags: ['resume', 'play', 'start', 'go', 'now']
    },
    IconIndent: {
        tags: ['increase list level', 'indent right']
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
    IconInwardSquaresThree: {
        tags: ['deploy']
    },
    IconItalicI: {
        tags: []
    },
    IconKey: {
        tags: ['access control', 'active directory']
    },
    IconLaptop: {
        tags: []
    },
    IconLayerGroup: {
        tags: ['jobs']
    },
    IconLightbulb: {
        tags: ['suggested', 'prompt', 'idea', 'think']
    },
    IconLightningBolt: {
        tags: ['active jobs']
    },
    IconLink: {
        tags: []
    },
    IconLinkCancel: {
        tags: ['unlink']
    },
    IconList: {
        tags: ['bullet', 'merged view']
    },
    IconListTree: {
        tags: ['tree view']
    },
    IconListTreeDatabase: {
        tags: ['measurement data analysis']
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
    IconMessage: {
        tags: ['comment', 'notes', 'alarm notes', 'speech', 'bubble']
    },
    IconMessagesSparkle: {
        tags: [
            'nigel',
            'chatbot',
            'ai',
            'chat',
            'help',
            'conversation',
            'comment'
        ]
    },
    IconMicrophone: {
        tags: ['talk to text', 'speech', 'speak', 'sound', 'audio']
    },
    IconMinus: {
        tags: ['mixed checkbox']
    },
    IconMinusWide: {
        tags: []
    },
    IconMobile: {
        tags: ['phone']
    },
    IconMountainSun: {
        tags: ['image', 'browse']
    },
    IconNi: {
        tags: ['National Instruments', 'logo', 'product']
    },
    IconNotebook: {
        tags: []
    },
    IconNumberList: {
        tags: ['order']
    },
    IconOutdent: {
        tags: ['decrease list level', 'indent left']
    },
    IconOutwardSquaresThree: {
        tags: ['undeploy']
    },
    IconPaperclip: {
        tags: ['attachment', 'add document', 'browse']
    },
    IconPaperPlane: {
        tags: ['send', 'relay', 'submit']
    },
    IconPaste: {
        tags: ['clipboard']
    },
    IconPause: {
        tags: ['stop', 'hold']
    },
    IconPencil: {
        tags: ['edit']
    },
    IconPencilToRectangle: {
        tags: ['new chat', 'conversation', 'ai']
    },
    IconPlay: {
        tags: ['arrow', 'start', 'go']
    },
    IconPotWithLid: {
        tags: ['box', 'utilities']
    },
    IconQuestion: {
        tags: ['help']
    },
    IconRectangleCheckLines: {
        tags: ['test', 'plan']
    },
    IconRectangleLines: {
        tags: ['defined', 'paper', 'paragraph', 'sentence', 'words']
    },
    IconRunningArrow: {
        tags: ['status', 'running']
    },
    IconScreenCheckLines: {
        tags: ['test', 'plan', 'monitor', 'desktop']
    },
    IconScreenCheckLinesCalendar: {
        tags: ['test', 'plan', 'schedule', 'monitor', 'desktop']
    },
    IconServer: {
        tags: ['analysis', 'automation']
    },
    IconShareNodes: {
        tags: []
    },
    IconShieldCheck: {
        tags: ['secure']
    },
    IconShieldXmark: {
        tags: ['insecure']
    },
    IconSignalBars: {
        tags: ['tdms channel group']
    },
    IconSineGraph: {
        tags: ['graph']
    },
    IconSkipArrow: {
        tags: ['status', 'skipped']
    },
    IconSparkles: {
        tags: ['clean up', 'stars']
    },
    IconSparkleSwirls: {
        tags: ['ai', 'artificial intelligence', 'magic', 'advanced automate']
    },
    IconSpinner: {
        tags: ['in progress']
    },
    IconSquareCheck: {
        tags: ['test insights']
    },
    IconSquareListCog: {
        tags: ['specification', 'requirements']
    },
    IconSquareT: {
        tags: ['static text']
    },
    IconSquareX: {
        tags: ['quit', 'end', 'abort', 'stop', 'terminate']
    },
    IconStar8Point: {
        tags: ['create new', 'burst']
    },
    IconStopSquare: {
        tags: ['quit', 'end']
    },
    IconSystemlink: {
        tags: ['logo', 'product']
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
        tags: ['tag query']
    },
    IconTargetCrosshairs: {
        tags: ['calibrate']
    },
    IconTargetCrosshairsProgress: {
        tags: ['calibrate', 'self calibrate']
    },
    IconThreeCirclesAscendingContainer: {
        tags: ['generate', 'produce']
    },
    IconThreeDotsLine: {
        tags: ['ellipsis', 'options']
    },
    IconThreeVerticalLines: {
        tags: []
    },
    IconThumbDown: {
        tags: ['dislike', 'disapprove', 'not good', 'no']
    },
    IconThumbtack: {
        tags: []
    },
    IconThumbUp: {
        tags: ['like', 'approve', 'good', 'yes']
    },
    IconTileSize: {
        tags: []
    },
    IconTimes: {
        tags: ['clear', 'close', 'delete', 'multiply', 'remove']
    },
    IconTrash: {
        tags: ['delete', 'remove']
    },
    IconTriangle: {
        tags: ['status', 'alarm active']
    },
    IconTriangleFilled: {
        tags: ['status']
    },
    IconTrueFalseRectangle: {
        tags: ['tdms boolean channel']
    },
    IconTriangleTwoLinesHorizontal: {
        tags: ['collapse all']
    },
    IconTwoSquaresInBrackets: {
        tags: ['group by']
    },
    IconTwoTrianglesBetweenLines: {
        tags: ['size column to content']
    },
    IconUnlink: {
        tags: ['link broken']
    },
    IconUnlock: {
        tags: []
    },
    IconUpload: {
        tags: []
    },
    IconUpRightFromSquare: {
        tags: ['export']
    },
    IconUser: {
        tags: ['admin', 'account']
    },
    IconWatch: {
        tags: ['status', 'waiting']
    },
    IconWaveform: {
        tags: ['tdms waveform channel']
    },
    IconWebviCustom: {
        tags: ['gweb']
    },
    IconWebviHost: {
        tags: ['gweb']
    },
    IconWindowCode: {
        tags: ['http api']
    },
    IconWindowDock: {
        tags: ['dock', 'place', 'embed', 'attach']
    },
    IconWindowRestore: {
        tags: ['undock', 'remove']
    },
    IconWindowText: {
        tags: ['manual']
    },
    IconWrenchHammer: {
        tags: ['status', 'custom']
    },
    IconXmark: {
        tags: ['status', 'fail', 'cancel']
    },
    IconXmarkCheck: {
        tags: ['self test']
    }
    /* eslint-enable @typescript-eslint/naming-convention */
};
