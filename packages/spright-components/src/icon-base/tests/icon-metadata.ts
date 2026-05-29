import type * as IconsNamespace from '../../icons/all-icons';

type IconName = keyof typeof IconsNamespace;

interface IconMetadata {
    tags: string[];
}

export const iconMetadata: {
    readonly [key in IconName]: IconMetadata;
} = {
    /* eslint-disable @typescript-eslint/naming-convention */
    IconBreakpointConditional: {
        tags: ['debug']
    },
    IconBreakpointDisabled: {
        tags: ['debug']
    },
    IconBreakpointEnabled: {
        tags: ['debug']
    },
    IconBreakpointExecutionPointer: {
        tags: ['debug']
    },
    IconBreakpointHit: {
        tags: ['debug']
    },
    IconBreakpointHitDisabled: {
        tags: ['debug']
    },
    IconBreakpointHover: {
        tags: ['debug']
    },
    IconNigelChat: {
        tags: ['nigel', 'chat', 'ai']
    },
    IconWorkItemCalendarWeek: {
        tags: ['reservation', 'booking', 'schedule', 'time slot']
    },
    IconWorkItemCalipers: {
        tags: ['calibration', 'quality', 'measurement', 'standards']
    },
    IconWorkItemForklift: {
        tags: ['logistics', 'delivery', 'transport', 'shipping']
    },
    IconWorkItemRectangleCheckLines: {
        tags: ['testing', 'verification', 'quality assurance', 'checklist']
    },
    IconWorkItemUserHelmetSafety: {
        tags: ['job', 'work', 'worker', 'operator', 'technician', 'safety']
    },
    IconWorkItemWrenchHammer: {
        tags: ['maintenance', 'repair', 'service', 'tools']
    }
};
