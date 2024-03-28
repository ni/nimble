const slideInLeftKeyframes: Keyframe[] = [
    {
        transform: 'translate(-100%)'
    },
    {
        transform: 'translate(0%)'
    }
];

const slideInRightKeyframes: Keyframe[] = [
    {
        transform: 'translate(100%)'
    },
    {
        transform: 'translate(0%)'
    }
];

const fadeInKeyFrames: Keyframe[] = [
    {
        opacity: '0'
    },
    {
        opacity: '1'
    }
];

const sharedOptions: KeyframeAnimationOptions = {
    // TODO: use token value for large delay
    // duration: 250,
    duration: 3000,
    easing: 'ease-in'
};

const slideInOptions: KeyframeAnimationOptions = {
    ...sharedOptions
};

const slideOutOptions: KeyframeAnimationOptions = {
    ...sharedOptions,
    direction: 'reverse'
};

const backdropFadeInOptions: KeyframeAnimationOptions = {
    ...sharedOptions,
    pseudoElement: '::backdrop'
};

const backdropFadeOutOptions: KeyframeAnimationOptions = {
    ...backdropFadeInOptions,
    direction: 'reverse'
};

export const animationConfig = {
    slideInLeftKeyframes,
    slideInRightKeyframes,
    fadeInKeyFrames,
    slideInOptions,
    slideOutOptions,
    backdropFadeInOptions,
    backdropFadeOutOptions
};