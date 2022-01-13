// Note: Initial slide animation keyframe (scale=0) is used because the drawer/dialog needs to have
// the correct computed width already before the slide (translateX) starts, but we don't want it to be visible
// at that point. We also can't use visibility=hidden as that results in the FAST dialog focusing code
// no longer focusing the first element when a modal drawer is shown.
const slideLeftKeyframes: Keyframe[] = [
    {
        transform: 'scale(0)',
        offset: 0
    },
    {
        transform: 'translateX(-100%)',
        offset: 0.01
    },
    {
        transform: 'translateX(0%)',
        offset: 1
    }
];

const slideRightKeyframes: Keyframe[] = [
    {
        transform: 'scale(0)',
        offset: 0
    },
    {
        transform: 'translateX(100%)',
        offset: 0.01
    },
    {
        transform: 'translateX(0%)',
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
