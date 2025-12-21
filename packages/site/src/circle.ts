export function encircle(): void {
    const circles = Array.from(document.getElementsByTagName('circle'));
    for (const circle of circles) {
        const time = randomIntFromInterval(30, 40);
        circle.style.setProperty('--circle-length', `${circle.getTotalLength()}px`);
        circle.style.setProperty('--circle-init-angle', `${randomIntFromInterval(35, 330)}deg`);
        circle.style.setProperty('--circle-end-angle', `${randomIntFromInterval(35, 330)}deg`);
        circle.style.setProperty('--circle-dash-offset', `${randomIntFromInterval(-45, 45)}%`);
        circle.style.setProperty('--circle-time', `${time}s`);
        circle.style.setProperty('--circle-start-time', `${randomIntFromInterval((time * -1), 0)}s`);
        circle.style.setProperty('--circle-direction', `${Math.random() < 0.5 ? 'alternate' : 'alternate-reverse'}`);
        circle.style.animationPlayState = 'running';
    }
    // trigger a layout so firefox recognizes the animation
    // See: https://gist.github.com/paulirish/5d52fb081b3570c81e3a#file-what-forces-layout-md
    void circles[0].clientHeight;
}

function randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
