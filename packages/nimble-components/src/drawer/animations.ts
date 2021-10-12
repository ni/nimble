export const slideAnimationId = 'DrawerSlideAnimation';

export const slideAnimationKeyframes: {
    [name: string]: PropertyIndexedKeyframes
} = {
    leftSide: {
        transform: ['translateX(-100%)', 'translateX(-100%)', 'translateX(0%)'],
        visibility: ['hidden', 'visible', 'visible'],
        offset: [0, 0.01, 1]
    },
    rightSide: {
        transform: ['translateX(100%)', 'translateX(100%)', 'translateX(0%)'],
        visibility: ['hidden', 'visible', 'visible'],
        offset: [0, 0.01, 1]
    }
};

export const slideAnimationOptions: {
    [name: string]: KeyframeAnimationOptions
} = {
    slideIn: {
        duration: 250,
        easing: 'ease-out',
        id: slideAnimationId
    },
    slideOut: {
        duration: 250,
        easing: 'ease-in',
        direction: 'reverse',
        id: slideAnimationId
    }
};
