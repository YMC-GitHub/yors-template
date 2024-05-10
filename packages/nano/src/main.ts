import './style.css'
import typescriptLogo from './typescript.svg'
// import { setupCounter,nanoargs } from '../lib/main'
import { nanoargs } from '../lib/main'
// import { setupCounter } from '../lib/counter'

export function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener("click", () => setCounter(++counter));
  setCounter(0);
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`
console.log(`[nano]`,JSON.stringify(nanoargs(`ns cmd -a -b -c -- -a -b -c`)))
setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
