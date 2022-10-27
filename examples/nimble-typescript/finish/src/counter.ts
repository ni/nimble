import { Button } from '@ni/nimble-components/dist/esm/button';

export function setupCounter(element: Button) {
  let counter = 0;

  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}