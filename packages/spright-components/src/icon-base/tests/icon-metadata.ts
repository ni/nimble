import type * as IconsNamespace from '../../icons/all-icons';

type IconName = keyof typeof IconsNamespace;

interface IconMetadata {
    tags: string[];
}

export const iconMetadata: {
    readonly [key in IconName]: IconMetadata;
} = {
    /* eslint-disable @typescript-eslint/naming-convention */
    IconWorkItemCalendarWeek: {
        tags: ['reservation', 'booking', 'schedule', 'time slot']
    },
    IconWorkItemForklift: {
        tags: ['logistics', 'delivery', 'transport', 'shipping']
    },
    IconWorkItemCalipers: {
        tags: ['calibration', 'quality', 'measurement', 'standards']
    },
    IconWorkItemRectangleCheckLines: {
        tags: ['testing', 'verification', 'quality assurance', 'checklist']
    },
    IconWorkItemWrenchHammer: {
        tags: ['maintenance', 'repair', 'service', 'tools']
    },
    IconWorkItemUserHelmetSafety: {
        tags: ['job', 'work', 'worker', 'operator', 'technician', 'safety']
    }
};
