import { useState } from 'react';
import './App.css';

export function App(): JSX.Element {
    const [count, setCount] = useState(0);

    return (
        <>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount(c => c + 1)}>
          count is {count}
                </button>
                <p>
          Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
        </>
    );
}
