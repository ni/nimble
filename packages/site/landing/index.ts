import '@ni/nimble-components/dist/esm/theme-provider/design-tokens';

const circleArray = Array.from(document.getElementById('circles')!.children) as SVGCircleElement[];

setupCircle();

function randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function addAnimation(animKeyFrames: string): void {
    const animationStyle = document.createElement('style');
    document.head.appendChild(animationStyle);
    const styleSheet = animationStyle.sheet!;
    styleSheet.insertRule(animKeyFrames, styleSheet.cssRules.length);
}

function getDirection(): string {
    if (Math.random() < 0.5) {
        return 'alternate';
    }
    return 'alternate-reverse';
}

function setupCircle(): void {
    [...circleArray].map(circle => {
        const circleLength = circle.getTotalLength();
        const circleID = circle.id;
        const initAngle = randomIntFromInterval(35, 330);
        const endAngle = randomIntFromInterval(35, 330);
        const dashOffset = randomIntFromInterval(-45, 45);
        addAnimation(`
        @keyframes move-${circleID} { 
            from {
                stroke-dasharray: ${circleLength};
                transform:rotate(${initAngle}deg);
            }
            to {
                stroke-dasharray: ${circleLength / 2};
                transform:rotate(${endAngle}deg);
            }
        }
        `);
        circle.style.transform = `rotate(${initAngle}deg)`;
        circle.style.strokeDashoffset = `${dashOffset}%`;
        circle.style.strokeDasharray = `${circleLength}`;
        const time = randomIntFromInterval(30, 40);
        const curve = 'ease-in-out';
        const startTime = randomIntFromInterval((time * -1), 0);
        const direction = getDirection();

        circle.style.animation = `${time}s ${curve} ${startTime}s infinite ${direction} move-${circleID}`;
        return true;
    });
}
