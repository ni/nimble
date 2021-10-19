const slideLeftKeyframes: Keyframe[] = [
    {
        transform: 'translateX(-100%)',
        visibility: 'hidden',
        offset: 0
    },
    {
        transform: 'translateX(-100%)',
        visibility: 'visible',
        offset: 0.01
    },
    {
        transform: 'translateX(0%)',
        visibility: 'visible',
        offset: 1
    }
];

const slideRightKeyframes: Keyframe[] = [
    {
        transform: 'translateX(100%)',
        visibility: 'hidden',
        offset: 0
    },
    {
        transform: 'translateX(100%)',
        visibility: 'visible',
        offset: 0.01
    },
    {
        transform: 'translateX(0%)',
        visibility: 'visible',
        offset: 1
    }
];

const fadeOverlayKeyframes: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }];

const slideInOptions = {
    duration: 1,
    easing: 'ease-out'
};

const slideOutOptions = {
    duration: 1,
    easing: 'ease-in',
    direction: 'reverse'
};

export const animationConfig = {
    slideLeftKeyframes,
    slideRightKeyframes,
    fadeOverlayKeyframes,
    slideInOptions,
    slideOutOptions
};
